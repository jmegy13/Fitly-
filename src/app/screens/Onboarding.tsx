import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, Shirt, Zap } from 'lucide-react';

export function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Camera,
      title: 'Upload Yourself',
      description: 'Take or upload a photo of yourself to get started',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shirt,
      title: 'Add Clothing Items',
      description: 'Browse or upload clothing items you want to try on',
      gradient: 'from-pink-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Instantly See Outfits',
      description: 'AI generates realistic try-on previews in seconds',
      gradient: 'from-orange-500 to-yellow-500',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-md"
          >
            <motion.div
              className={`w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {(() => {
                const IconComponent = slides[currentSlide].icon;
                return IconComponent ? <IconComponent className="w-16 h-16 text-white" /> : null;
              })()}
            </motion.div>

            <h1 className="text-4xl font-bold mb-4">{slides[currentSlide].title}</h1>
            <p className="text-lg text-gray-400">{slides[currentSlide].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12">
        <div className="flex gap-2 justify-center mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-white" />
        <span className="text-xl font-bold">Fitly</span>
      </div>
    </div>
  );
}
