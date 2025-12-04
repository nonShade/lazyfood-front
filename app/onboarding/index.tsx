import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

interface OnboardingData {
  name: string;
  cookingLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  dietType: string[];
  allergies: string[];
  goals: string[];
}

const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    cookingLevel: '',
    dietType: [],
    allergies: [],
    goals: []
  });

  useEffect(() => {
    if (user?.nombre) {
      setData(prev => ({ ...prev, name: user.nombre }));
    }
  }, [user]);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/home');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            data={{ name: data.name, cookingLevel: data.cookingLevel }}
            onDataChange={updateData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2
            data={{ dietType: data.dietType, allergies: data.allergies }}
            onDataChange={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3
            data={{ goals: data.goals }}
            onDataChange={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={currentStep} totalSteps={3} />
      {renderCurrentStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});

export default OnboardingFlow;
