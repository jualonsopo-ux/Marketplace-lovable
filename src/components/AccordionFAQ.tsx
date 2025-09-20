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
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="bg-card rounded-xl shadow-sm border border-border/50">
            <button
              className="w-full text-left p-4 font-semibold flex justify-between items-center hover:bg-muted/50 transition-colors rounded-xl"
              onClick={() => toggleAccordion(index)}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
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
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccordionFAQ;