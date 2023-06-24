import { useReducer, useEffect, type ReactNode } from "react";
import type { ExtractFinalityFromFinalityDescription } from "./types";
import type { RegisteredLinkProps } from "../link";
import { createUseGdpr } from "./useGdpr";
import { createProcessConsentChanges, type GdprConsentCallback } from "./processConsentChanges";
import { createStatefulObservable } from "../tools/StatefulObservable";
import type { FinalityConsent } from "./types";
import { useRerenderOnChange } from "../tools/StatefulObservable/hooks";
import { createConsentBannerAndConsentManagement } from "./ConsentBannerAndConsentManagement";
import { isBrowser } from "../tools/isBrowser";

export function createGdprApi<
    FinalityDescription extends Record<
        string,
        { title: ReactNode; description?: ReactNode; subFinalities?: Record<string, ReactNode> }
    >
>(params: {
    finalityDescription: ((params: { lang: string }) => FinalityDescription) | FinalityDescription;
    callback?: GdprConsentCallback<ExtractFinalityFromFinalityDescription<FinalityDescription>>;
    /** Optional: If you have a dedicated page that provides comprehensive information about your website's GDPR policies. */
    personalDataPolicyLinkProps?: RegisteredLinkProps;
}) {
    type Finality = ExtractFinalityFromFinalityDescription<FinalityDescription>;

    const { finalityDescription, personalDataPolicyLinkProps, callback } = params;

    const localStorageKey = "@codegouvfr/react-dsfr gdpr finalityConsent";

    const $finalityConsent = createStatefulObservable<FinalityConsent<Finality> | undefined>(() => {
        if (!isBrowser) {
            return undefined;
        }

        const serializedFinalityConsent = localStorage.getItem(localStorageKey);

        if (serializedFinalityConsent === null) {
            return undefined;
        }

        return JSON.parse(serializedFinalityConsent);
    });

    const finalities = getFinalitiesFromFinalityDescription({
        "finalityDescription":
            typeof finalityDescription === "function"
                ? finalityDescription({ "lang": "fr" })
                : finalityDescription
    });

    const { processConsentChanges, useRegisterCallback } = createProcessConsentChanges<Finality>({
        callback,
        finalities,
        "getFinalityConsent": () => $finalityConsent.current,
        "setFinalityConsent": ({ finalityConsent, prAllCallbacksRun }) => {
            localStorage.setItem(localStorageKey, JSON.stringify(finalityConsent));

            prAllCallbacksRun.then(() => ($finalityConsent.current = finalityConsent));
        }
    });

    function useFinalityConsent() {
        useRerenderOnChange($finalityConsent);

        const [isHydrated, setIsHydrated] = useReducer(() => true, true);

        useEffect(() => {
            setIsHydrated();
        }, []);

        if (!isHydrated) {
            return undefined;
        }

        return $finalityConsent.current;
    }

    const { useGdpr } = createUseGdpr({
        useFinalityConsent,
        processConsentChanges,
        useRegisterCallback
    });

    const {
        ConsentBannerAndConsentManagement,
        FooterConsentManagementItem,
        FooterPersonalDataPolicyItem
    } = createConsentBannerAndConsentManagement({
        finalityDescription,
        personalDataPolicyLinkProps,
        processConsentChanges,
        useFinalityConsent,
        finalities
    });

    return {
        useGdpr,
        ConsentBannerAndConsentManagement,
        FooterConsentManagementItem,
        FooterPersonalDataPolicyItem
    };
}

/** pure, exported for testing */
export function getFinalitiesFromFinalityDescription<
    FinalityDescription extends Record<
        string,
        { title: ReactNode; description?: ReactNode; subFinalities?: Record<string, ReactNode> }
    >
>(params: {
    finalityDescription: FinalityDescription;
}): ExtractFinalityFromFinalityDescription<FinalityDescription>[] {
    const { finalityDescription } = params;

    type Finality = ExtractFinalityFromFinalityDescription<FinalityDescription>;

    const finalities: Finality[] = [];

    for (const mainFinality in finalityDescription) {
        const description = finalityDescription[mainFinality];

        const { subFinalities } = description as any;

        if (subFinalities === undefined) {
            finalities.push(mainFinality as Finality);
            continue;
        }

        for (const subFinality in subFinalities) {
            finalities.push(`${mainFinality}.${subFinality}` as Finality);
        }
    }

    return finalities;
}
