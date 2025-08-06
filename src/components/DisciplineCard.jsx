
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const DisciplineCard = ({ discipline, onSelect, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: index * 0.1 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className="h-full flex flex-col justify-between glass-effect hover:bg-white/20 transition-all duration-300 group"
        onClick={() => onSelect(discipline)}
      >
        <CardContent className="p-6 flex-grow">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {discipline.name}
              </h3>
              <p className="text-sm text-gray-300">
                {discipline.questions?.length || 0} perguntas
              </p>
            </div>
          </div>
        </CardContent>
        <div className="p-4 pt-0">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
          >
            Acessar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default DisciplineCard;
