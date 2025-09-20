import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionFAQProps {
  items: FAQItem[];
  title?: string;
}

const AccordionFAQ = ({ items, title = "Preguntas frecuentes" }: AccordionFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="notion-card">
            <button
              className="w-full text-left p-4 font-medium text-sm flex justify-between items-center hover:bg-muted/30 transition-colors rounded-lg"
              onClick={() => toggleAccordion(index)}
            >
              <span className="text-foreground">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <div className="px-4">
                <p className="text-muted-foreground text-xs leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccordionFAQ;