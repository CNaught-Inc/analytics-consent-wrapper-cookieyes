'use client';

import {
    type AnyAnalytics,
    type ConsentModel,
    createWrapper,
    type CreateWrapperSettings,
    resolveWhen
} from '@segment/analytics-consent-tools';

import {
    activeLawToConsentModel,
    type CkyConsent,
    getCkyConsent,
    onCkyConsentUpdate
} from './cky-consent';

export interface CookieYesSettings {
    integrationCategoryMappings?: CreateWrapperSettings['integrationCategoryMappings'];
    disableConsentChangedEvent?: boolean;
    /**
     * Override configured consent model
     * - `opt-in` (strict/GDPR, default) - wait for explicit consent before loading segment and all destinations.
     * - `opt-out` - load segment and all destinations without waiting for explicit consent.
     */
    consentModel?: () => ConsentModel;
    /**
     * Enable debug logging for OneTrust wrapper
     */
    enableDebugLogging?: boolean;
}

// Helpful but difficult to find CookieYes docs
// - https://www.cookieyes.com/documentation/retrieving-consent-data-using-api-getckyconsent/
// - https://www.cookieyes.com/documentation/events-on-cookie-banner-interactions/
// Segment wrapper example: https://github.com/segmentio/analytics-next/tree/master/packages/consent/consent-tools#quick-start

/**
 * Segment analytics wrapper for CookieYes CMP
 */
export const withCookieYes = <TAnalytics extends AnyAnalytics>(
    analyticsInstance: TAnalytics,
    settings: CookieYesSettings = {}
) =>
    createWrapper<TAnalytics>({
        shouldLoadWrapper: async () => {
            await resolveWhen(() => !!window.getCkyConsent, 500);
        },
        shouldLoadSegment: async (ctx) => {
            const { activeLaw, isUserActionCompleted, categories } =
                getCkyConsent();
            const consentModel =
                settings.consentModel?.() ?? activeLawToConsentModel(activeLaw);

            if (consentModel === 'opt-in') {
                await resolveWhen(
                    () =>
                        isUserActionCompleted &&
                        Object.values(categories).some((v) => v),
                    500
                );
            }
            return ctx.load({ consentModel });
        },
        getCategories: () => getCkyConsent().categories,
        registerOnConsentChanged: settings.disableConsentChangedEvent
            ? undefined
            : (setCategories) => {
                  onCkyConsentUpdate((eventData) => {
                      const categories: { [key: string]: boolean } = {};
                      eventData.detail.accepted.forEach(
                          (c) => (categories[c] = true)
                      );
                      eventData.detail.rejected.forEach(
                          (c) => (categories[c] = false)
                      );

                      setCategories(categories);
                  });
              },
        integrationCategoryMappings: settings.integrationCategoryMappings,
        enableDebugLogging: settings.enableDebugLogging
    })(analyticsInstance);
