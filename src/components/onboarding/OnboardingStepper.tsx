"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {createOnboardingSteps} from "./onboardingSteps";
import {useActivityAnalysis} from "@/src/hooks/useActivityAnalysis";
import {useEffect} from "react";


export default function OnboardingStepper() {
    const {
        stagedActivities,
        summary,
        processFiles
    } = useActivityAnalysis();
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = createOnboardingSteps(
        processFiles,
        summary,
        stagedActivities
    );

    useEffect(() => {
        console.log('stagedActivities', stagedActivities);
        if (stagedActivities.length > 0) {
            setActiveStep(2);
        }
    }, [stagedActivities]);

    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={(<Typography variant="caption">{step.description}</Typography>)}
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            {step.render()}

                            {activeStep > 0 && <Button
                                onClick={() => setActiveStep((s) => s - 1)}>
                                Back
                            </Button>}
                            {activeStep !== steps.length - 1 && <Button
                                onClick={() => setActiveStep((s) => s + 1)}>
                                Next
                            </Button>}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <Button
                onClick={() => setActiveStep(0)}
            >
                Reset
            </Button>
        </Box>
    );
}