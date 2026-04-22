import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import useCardStore from '../../store/useCardStore';
import CardPreview from '../card/CardPreview';
import Button from '../ui/Button';
import { TEMPLATES } from '../../utils/templates';

const FONTS = ['Inter', 'Georgia', 'Trebuchet MS', 'Arial', 'Verdana'];

const Step2Design = ({ onNext, onBack }) => {
  const { draft, setDraftNested } = useCardStore();
  const design = draft.design || {};

  const applyTemplate = (template) => {
    setDraftNested('design', { ...template.styles, template: template.id, layout: template.layout });
  };

  const update = (key, value) => {
    setDraftNested('design', { [key]: value });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Controls */}
      <div className="flex-1 space-y-8">
        {/* Templates */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Template</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {TEMPLATES.map((tpl) => {
              const isActive = design.template === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => applyTemplate(tpl)}
                  className={`relative rounded-xl p-3 text-xs font-medium transition-all border ${
                    isActive
                      ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                      : 'border-white/10 bg-surface-100 text-white/60 hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded-lg mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${tpl.styles.primaryColor}, ${tpl.styles.secondaryColor})`,
                    }}
                  />
                  {tpl.name}
                  {isActive && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Colors</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.primaryColor || '#8b5cf6'}
                  onChange={(e) => update('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-white/40 font-mono">{design.primaryColor || '#8b5cf6'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.secondaryColor || '#ec4899'}
                  onChange={(e) => update('secondaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-white/40 font-mono">{design.secondaryColor || '#ec4899'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.bgColor || '#0a0a0f'}
                  onChange={(e) => update('bgColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-white/40 font-mono">{design.bgColor || '#0a0a0f'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Font */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Font</h3>
          <div className="flex flex-wrap gap-2">
            {FONTS.map((font) => (
              <button
                key={font}
                onClick={() => update('font', font)}
                style={{ fontFamily: font }}
                className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                  design.font === font
                    ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                    : 'border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Layout & Style */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Layout</h3>
            <div className="space-y-2">
              {[
                { value: 'centered', label: 'Centered' },
                { value: 'left', label: 'Left Aligned' },
                { value: 'cover', label: 'Cover' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('layout', opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                    design.layout === opt.value
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Corners</h3>
            <div className="space-y-2">
              {[
                { value: 'rounded', label: 'Rounded' },
                { value: 'sharp', label: 'Sharp' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('cornerStyle', opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                    design.cornerStyle === opt.value
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-white/80 mb-3 mt-4 uppercase tracking-wider">Spacing</h3>
            <div className="space-y-2">
              {['compact', 'normal', 'relaxed'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => update('spacing', opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all capitalize ${
                    design.spacing === opt
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} fullWidth>← Back</Button>
          <Button onClick={onNext} fullWidth>Continue to Publish →</Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:w-80 flex-shrink-0">
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Live Preview</h3>
        <div className="sticky top-24 flex justify-center">
          <CardPreview draft={draft} scale={0.85} />
        </div>
      </div>
    </div>
  );
};

export default Step2Design;
