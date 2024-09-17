export type ActiveLaw = 'gdpr' | 'ccpa';

export type ConsentModel = 'opt-in' | 'opt-out';

export interface CkyConsent {
    activeLaw: ActiveLaw;
    categories: {
        necessary: boolean;
        functional: boolean;
        analytics: boolean;
        performance: boolean;
        advertisement: boolean;
    };
    isUserActionCompleted: boolean;
    consentID: boolean;
    languageCode: string;
}

export function getCkyConsent(): CkyConsent {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    return window.getCkyConsent?.()!;
}

export function activeLawToConsentModel(activeLaw: ActiveLaw): ConsentModel {
    switch (activeLaw) {
        case 'ccpa':
            return 'opt-out';
        case 'gdpr':
        default:
            return 'opt-in';
    }
}

interface CkyEventData {
    detail: {
        accepted: string[];
        rejected: string[];
    };
}

export function onCkyConsentUpdate(fn: (eventData: CkyEventData) => unknown) {
    document.addEventListener('cookieyes_consent_update' as any, fn);
}
