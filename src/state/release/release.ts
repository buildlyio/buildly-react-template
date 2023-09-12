import {createMachine, assign} from 'xstate';
import { Release } from '../../interfaces/release';
import {loadReleases, submitRelease} from './actions';

export const releaseMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QCcwBswENZwHQFEA7AF2QE9cAZAe0wgEtCoBiCawsXRgN2oGtOqDNjxFSFGnUZQEPagGNMxeuwDaABgC6GzYlAAHarHrL2ekAA9EAJgAsARlwAOe-YfWXANntOnAdgBWABoQMkQAWld1XABmewCA208ATgDPGPV7T08AXxyQoSwcWAIScipaBiZmMGRkamRcfTQlADMGgFtcQpESsXLJKpk5RVNCHR1zQ2Mx8ysEGO9cWxXrawC4719AkLCF6Jjktydba2TF5KcY2zyC9CLRMolKyGYLWGIlTkxW4lqACgC6nUAEpmD1iqVxBU6JBJkgQNMTCpCHNEJ5rH5lkd7MDNj5-LsIjEArh1N5PLZ1H5yRksrl8iAIY9oQAxToAESUmGYAGUAK4AIw6JnhBiMyLMCPmuMSZPJfnW+O2RIQTmcHkup3OKSuN0ZzL6T1w7OQHS5nz5QpFxFU9l0CKRs2liCiMVwa3OLjSW0JoQiWXdmScnj89lS6Uy2VuTPuvVwAuFJmUTFwAFV9BAlNJWOxOHIBN045DEzaU1B05ns0xZIReKMURMtFMJc7QPNkh5cPYaU5yelOwF7NZVdZPAcAnZrD2dZdrjHDQnrcnpJWs+WanUGk0WsR2mai8IS8viOW19XhnWFNm1FoxYjWyi0QgktFpzFAp4fQSdv6EOH1WBWw-C-RILj1BdixZcoAEkIAwZhBnvJ0nxdf9MkcXEnA8PwvB-VVKXdWwNmSYDwzsDYAjyRlCGoCA4HMQ0WxmVD21dYjnFcdw8O2YI-3CDxSTiBIkgjOlowNKCjXEZjJVRNDw3dFw3GHHj-D4vZImSLFvUSFI0nEhk7iPaDnikJhZLbSxEF8IMUjWDYsnwv9bF8Zx1FIjZ1FscD50kkzpIGF4IEs1jrIQbTklwVJrHUH1DnWYdVSyaxlicSdh1wzFfCM2MAqhIK6FZTB6AwELHUfKU2IWSlcFDEM8Sc3iCNOD11EOMjO2IklIPy-oKFNc1uVCqrwoSaIAj8OJhOyZy9k8JwouHbTVIynx9WMh5AooOCMBG+TqpOWxcCHbrcKav15ta2KOrDLrKN6ralyTYhitKyB9ufSaotsHFGt9PxVV8UkvTOXFXFwmIYke+NS2TD6KpY0b5m+7Eonai7Ab-XFYuWGIrnJFbQyo-ynrh09pE+hSUrquJFUcgHkppE7cK1M5fI2vKyZPM8AGFUAvKnquHXFaZ7JVMdHAJANZk52d1PzNthnnVwzddKcRuTnxF6J0nFhm5sQHyosmxaMSy3D0uonIgA */
        tsTypes: {} as import('./release.typegen').Typegen0,

        context: {
            releases: [] as any,
            error: undefined as string | undefined,
        },

        id: 'releases',

        states: {
            Entry: {
                states: {
                    Loading: {
                        invoke: {
                            src: loadReleases,
                            onDone: [
                                {
                                    target: 'Loaded',
                                    actions: 'addReleasesToContext'
                                }
                            ],
                            onError: [
                                {
                                    target: 'LoadFailed',
                                    actions: 'addErrorToCxt'
                                }

                            ]
                        }
                    },

                    Loaded: {
                        after: {
                            "500": "FormData"
                        }
                    },

                    LoadFailed: {},

                    FormData: {
                        on: {
                            Submit: [{
                                target: "#releases.Submitting.Updating",
                                cond: "release_uuid"
                            }, "#releases.Submitting.Creating"]
                        }
                    },

                    Idle: {
                        on: {
                            Load: "Loading"
                        }
                    }
                },

                initial: "Idle"
            },

            SubmitFailed: {},
            Submitted: {},

            Submitting: {
                states: {
                    Creating: {
                        invoke: {
                            src: submitRelease
                        },
                    },
                    Updating: {
                        invoke: {
                            src: submitRelease,
                            onDone: {actions: 'addSingleReleaseToCxt', target: '#releases.Submitted'},
                            onError: {actions: 'addErrorToCxt', target: '#releases.SubmitFailed'}
                        },
                    }
                }
            }
        },

        initial: "Entry"
    },
    {
        actions: {
            addReleasesToContext: assign(
                (context, event) => {
                return {releases: event.data};
            }),
            addErrorToCxt: assign((context, event) => {
                return {error: (event.data as Error).message};
            }),
            addSingleReleaseToCxt: assign((context, event) => {
                const releases = [...context.releases, event.data]
                return {...{releases}}
            })
        },
    }
);
