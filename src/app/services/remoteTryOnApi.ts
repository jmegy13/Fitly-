import { appConfig, hasAiTryOnConfig, hasGeminiConfig } from '../config/env';
import { ServiceError } from '../types';
import { apiRequest } from './apiClient';
import type { TryOnApi } from './serviceTypes';

type RemoteTryOnResponse = {
  id: string;
  title: string;
  resultImage: string;
  createdAt: string;
};

function parseDataUrl(dataUrl: string) {
  const [header, data] = dataUrl.split(',');
  const mimeType = header.match(/data:(.*);base64/)?.[1] ?? 'image/png';
  return { mimeType, data };
}

async function urlToInlineImageData(image: string) {
  const response = await fetch(image);
  if (!response.ok) {
    throw new ServiceError('generation_failed', 'Could not load image bytes for Gemini.');
  }

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return {
    mimeType: blob.type || 'image/png',
    data: window.btoa(binary),
  };
}

async function getInlineImageData(image: string) {
  if (!image.startsWith('data:')) {
    return urlToInlineImageData(image);
  }

  return parseDataUrl(image);
}

async function generateWithGemini(request: Parameters<TryOnApi['generate']>[0], options?: Parameters<TryOnApi['generate']>[1]) {
  if (!hasGeminiConfig()) {
    throw new ServiceError('integration_not_configured', 'Gemini API key is not configured.');
  }

  options?.onProgress?.('Analyzing your photo', 0);
  const selfie = await getInlineImageData(request.selfie.image);
  const clothing = await getInlineImageData(request.clothing.image);

  options?.onProgress?.('Detecting clothing shape', 1);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${appConfig.geminiModel}:generateContent?key=${appConfig.geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'Create a realistic virtual try-on image. Use the first image as the person/selfie and the second image as the clothing item. Return an image result only if the model supports image output.',
              },
              { inlineData: { mimeType: selfie.mimeType, data: selfie.data } },
              { inlineData: { mimeType: clothing.mimeType, data: clothing.data } },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new ServiceError('generation_failed', `Gemini generation failed with status ${response.status}.`);
  }

  options?.onProgress?.('Generating your fit', 2);
  const payload = await response.json();
  const imagePart = payload?.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new ServiceError(
      'generation_failed',
      'Gemini did not return an image. Use an image-capable Gemini model or route this through a backend AI service.',
    );
  }

  options?.onProgress?.('Finalizing details', 3);
  return {
    id: `gemini-${Date.now()}`,
    title: request.clothing.label,
    selfie: request.selfie,
    clothing: request.clothing,
    resultImage: `data:${imagePart.inlineData.mimeType ?? 'image/png'};base64,${imagePart.inlineData.data}`,
    createdAt: new Date().toISOString(),
    isFavorite: true,
  };
}

export const remoteTryOnApi: TryOnApi = {
  async generate(request, options) {
    if (!hasAiTryOnConfig()) {
      throw new ServiceError('integration_not_configured', 'AI try-on API URL is not configured.');
    }

    if (hasGeminiConfig()) {
      return generateWithGemini(request, options);
    }

    options?.onProgress?.('Uploading request', 0);

    const response = await apiRequest<RemoteTryOnResponse>(`${appConfig.aiTryOnApiUrl}/try-on`, {
      method: 'POST',
      body: {
        userId: request.userId,
        selfieImage: request.selfie.image,
        clothingImage: request.clothing.image,
      },
    });

    options?.onProgress?.('Finalizing details', 3);

    return {
      id: response.id,
      title: response.title || request.clothing.label,
      selfie: request.selfie,
      clothing: request.clothing,
      resultImage: response.resultImage,
      createdAt: response.createdAt,
      isFavorite: true,
    };
  },
};
