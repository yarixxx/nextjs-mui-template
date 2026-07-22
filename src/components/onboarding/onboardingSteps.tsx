import React from "react";

import {WelcomeStep} from "./WelcomeStep";
import {UploadStep} from "./UploadStep";
import {PreviewStep} from "./PreviewStep";
import {ActivitiesListStep} from "./ActivitiesListStep";
import {AnalysisStep} from "./AnalysisStep";
import {SummaryMapStep} from "./SummaryMapStep";
import SignupForm from "@/src/components/onboarding/SignupForm";


export type StepDefinition = {
    label: string;
    description: string;
    render: () => React.ReactNode;
};


export function createOnboardingSteps(
    filesSelectedHandler: (files: File[]) => Promise<void>,
    summary: string,
    activities: any[]
): StepDefinition[] {

    return [
        {
            label: "Welcome to GPX Analyser",
            description: "Brief introduction",
            render: () => <WelcomeStep/>
        },
        {
            label: "Getting started",
            description: "Upload activity",
            render: () =>
                <UploadStep
                    filesSelectedHandler={filesSelectedHandler}
                />
        },
        {
            label: "Preview Activity",
            description: "Preview map",
            render: () =>
                <PreviewStep
                    summary={summary}
                    activities={{
                        type: "FeatureCollection",
                        features: activities
                    }}
                />
        },
        {
            label: "Activities Findings",
            description: "Show all activities",
            render: () =>
                <ActivitiesListStep/>
        },
        {
            label: "Summary",
            description: "Show findings",
            render: () =>
                <AnalysisStep/>
        },
        {
            label: "Summary Map",
            description: "Show summary map",
            render: () =>
                <SummaryMapStep/>
        },
        {
            label: "Create Account",
            description: "To keep your progress create account",
            render: () =>
                <SignupForm/>
        }
    ];
}