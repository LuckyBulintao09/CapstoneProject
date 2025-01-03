'use client';

import { ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();

  const words = [
    { text: 'Welcome ' },
    { text: 'to ' },
    { text: 'SGODOSS ', className: 'text-blue-800' },
  ];

  const heroBadgeText = "New Release";
  const heroDescription = "Schools Governance and Operations Division Online Support System";
  const buttonLearnMoreText = "Explore Programs";

  const typewriterEffectStyle: React.CSSProperties = {
    display: 'inline-block',
    borderRight: '4px solid',
    paddingRight: '4px',
    animation: 'typing 5s steps(300) 1s forwards, blink 2.5s step-end infinite',
    whiteSpace: 'nowrap',
    overflow: 'hidden', 
  };

  const typingAnimation = `
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink {
      50% { border-color: transparent; }
    }
  `;

  return (
    <section className="px-2 sm:px-4 md:px-6 lg:px-8">
      <style>{typingAnimation}</style>
      <div className="flex flex-col-reverse lg:flex-row items-start gap-6"> 
        <div className="flex flex-col items-start text-left w-full lg:w-2/3">
          <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-5xl md:text-3xl lg:text-6xl">
            <span style={typewriterEffectStyle}>
              {words.map((word, index) => (
                <span key={index} className={word.className}>
                  {word.text}
                </span>
              ))}
            </span>
          </h3>
          <p className="mb-8 max-w-xl lg:text-xl text-muted-foreground dark:text-muted-foreground sm:text-lg">
            {heroDescription}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            <Button
              variant="outline"
              className="w-full sm:w-auto dark:bg-accent-foreground dark:text-secondary hover:bg-accent"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/resources';
                }
              }}
            >
              {buttonLearnMoreText}
              <ArrowDownRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
