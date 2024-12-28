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
  const buttonLearnMoreText = "View Services";

  const typewriterEffectStyle: React.CSSProperties = {
    display: 'inline-block',
    borderRight: '4px solid',
    paddingRight: '4px',
    animation: 'typing 4s steps(200) 1s forwards, blink 1.5s step-end infinite',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    overflowWrap: 'anywhere', 
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
    <section className="px-4 sm:px-16 md:px-8 lg:px-32">
      <style>{typingAnimation}</style>
      <div className="flex flex-col-reverse lg:flex-row items-center gap-6">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-5xl md:text-3xl lg:text-6xl max-w-full">
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
                  window.location.href = '/services';
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
