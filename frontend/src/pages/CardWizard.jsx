import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import useCardStore from '../store/useCardStore';
import AppLayout from '../components/layout/AppLayout';
import Spinner from '../components/ui/Spinner';
import CardPreview from '../components/card/CardPreview';

const Step1Content = lazy(() => import('../components/wizard/Step1Content'));
const Step2Design = lazy(() => import('../components/wizard/Step2Design'));
const Step3Publish = lazy(() => import('../components/wizard/Step3Publish'));
const Step4Print = lazy(() => import('../components/wizard/Step4Print'));

const STEPS = [
  { label: 'Content', desc: 'Profile & info' },
  { label: 'Design', desc: 'Style & theme' },
  { label: 'Publish', desc: 'URL & QR code' },
  { label: 'Print', desc: 'Download card' },
];

const CardWizard = () => {
  const { currentStep, setStep, draft } = useCardStore();

  const next = () => setStep(Math.min(currentStep + 1, 3));
  const back = () => setStep(Math.max(currentStep - 1, 0));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">
            {currentStep === 0 && 'Build your card'}
            {currentStep === 1 && 'Design your card'}
            {currentStep === 2 && 'Publish & share'}
            {currentStep === 3 && 'Print your card'}
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mt-6">
            {STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => i < currentStep && setStep(i)}
                  className={`flex items-center gap-2 ${i <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < currentStep
                        ? 'bg-primary-500 text-white'
                        : i === currentStep
                        ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-400'
                        : 'bg-surface-200 text-white/30 border border-white/10'
                    }`}
                  >
                    {i < currentStep ? <Check size={14} /> : i + 1}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-medium ${i === currentStep ? 'text-white' : 'text-white/40'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-white/25">{step.desc}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${i < currentStep ? 'bg-primary-500' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-10">
          {/* Main wizard panel */}
          <div className="flex-1 min-w-0">
            <div className="glass-card border border-white/5">
              <Suspense fallback={
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
              }>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {currentStep === 0 && <Step1Content onNext={next} />}
                    {currentStep === 1 && <Step2Design onNext={next} onBack={back} />}
                    {currentStep === 2 && <Step3Publish onNext={next} onBack={back} />}
                    {currentStep === 3 && <Step4Print onBack={back} />}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </div>

            {currentStep === 0 && (
              <div className="xl:hidden mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Live preview</h3>
                <p className="text-xs text-white/40 mb-4 -mt-2">Updates as you edit. Same draft is saved in your browser.</p>
                <div className="flex justify-center overflow-x-auto pb-2">
                  <CardPreview draft={draft} scale={0.82} />
                </div>
              </div>
            )}
          </div>

          {/* Preview sidebar (visible on xl) */}
          {currentStep !== 1 && (
            <div className="hidden xl:flex xl:flex-col xl:w-80 flex-shrink-0">
              <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Preview</h3>
              <div className="sticky top-24">
                <CardPreview draft={draft} scale={0.9} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CardWizard;
