"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {ReactNode} from "react";
import {Modal} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function VerticalLinearStepper() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const steps = [
        {
            label: 'Step 1',
            description: <>Important <b>step</b> <a href="https://mui.com/material-ui/all-components/">See
                components</a> one!</>,
        },
        {
            label: 'Step 2',
            description:
                <div>
                    <p>Also <i>important</i> step two!</p>
                    <Button
                        onClick={handleOpen}
                        sx={{mt: 1, mr: 1}}
                    >
                        Show modal
                    </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{...style, width: 400}}>
                            <h2 id="parent-modal-title">Text in a modal</h2>
                            <p id="parent-modal-description">
                                Dues mollies, est non commodo quits, nisi erat portion ligula.
                            </p>
                        </Box>
                    </Modal>
                </div>,
        },
    ] as {
        label: string;
        description: string | ReactNode
    }[];

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const previousActiveStepRef = React.useRef(activeStep);
    const continueButtonRef = React.useRef<HTMLButtonElement>(null);
    const backButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetButtonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        const previousActiveStep = previousActiveStepRef.current;
        previousActiveStepRef.current = activeStep;

        if (previousActiveStep < activeStep) {
            if (activeStep === steps.length) {
                resetButtonRef.current!.focus();
            } else {
                continueButtonRef.current!.focus();
            }
            return;
        }

        if (activeStep === 0) {
            continueButtonRef.current!.focus();
            return;
        }

        backButtonRef.current!.focus();
    }, [activeStep, steps.length]);

    return (
        <Box sx={{maxWidth: 400}}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <div>{step.description}</div>
                            <Box sx={{mb: 2}}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{mt: 1, mr: 1}}
                                    ref={continueButtonRef}
                                >
                                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                </Button>
                                {index !== 0 && (
                                    <Button
                                        onClick={handleBack}
                                        sx={{mt: 1, mr: 1}}
                                        ref={backButtonRef}
                                    >
                                        Back
                                    </Button>
                                )}
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{p: 3}}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{mt: 1, mr: 1}} ref={resetButtonRef}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}