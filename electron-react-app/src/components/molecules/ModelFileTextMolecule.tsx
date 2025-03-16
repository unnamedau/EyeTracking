// src/components/molecules/ModelFileTextMolecule.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ModelFileTextMolecule: React.FC = () => {
  const modelFile = useSelector((state: RootState) => state.config.modelFile);

  if (!modelFile) return null;

  return <p className="text-normal">{modelFile}</p>;
};

export default ModelFileTextMolecule;
