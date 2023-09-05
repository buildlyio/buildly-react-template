import {createMachine, assign} from 'xstate';
import {Release} from '../../interfaces/release';

export const releaseMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QCcwBswENZwHQBkB7TCASwDsoACAJXSx1gGIJDyxcKA3Qgaw9QZseIiQrU6Qxgm6EAxpgAupNgG0ADAF0NmxKAAOhWKWVs9IAB6IA7AGZcAVgBsAJgcAaEAE9EAWgAsAJyOAIwh1iEAHNYOAL6xnoIMIsRklLT0wsxgyMiEyLj6aEoAZvkAtrhJWQSp4hlScDLkPAqm5Do65obG7eZWCL4uIS64gU7+kf62MZ4+g0Gh4VEx8Qkg5IQQcObVjN1GJirk-X4uTupjE1MzHt5+ITO46mER0XHreyli6ZLJ8EgQD0jmZAQMXPZIrYXOpbCM7vMXJNcLYHA5-E53vFEplGLg-lkqKJthADr1jqcEEiQiiHIFbnNENCHLhIoF-A44W5sSAvrBaj9qAAxTCkDCkwHAvpgh6Y3AhQKBYbvRkIOGRXBBZWrNZAA */
        tsTypes: {} as import('./release.typegen').Typegen0,
        schema: {
            services: {} as {
                loadReleases: { data: Release; };
            },
        },
        context: {
            releases: [] as any,
            error: undefined as string | undefined,
        },
        id: 'releases',
        initial: 'Loading Releases',
        states: {
            'Loading Releases': {
                invoke: {
                    src: 'loadReleases',
                    onDone: [
                        {
                            target: 'Releases Loaded',
                            actions: 'addReleasesToContext',
                        },
                    ],
                    onError: [
                        {
                            target: 'Loading Failed',
                            actions: 'addErrorToCxt',
                        },
                    ],
                },
            },

            'Releases Loaded': {},
            'Loading Failed': {},
        },
    },
    {
        actions: {
            addReleasesToContext: assign((context, event) => {
                return {releases: event.data};
            }),
            addErrorToCxt: assign((context, event) => {
                return {error: (event.data as Error).message};
            }),
        },
    }
);
