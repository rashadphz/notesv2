/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchNotesResponse } from '../models/SearchNotesResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SearchService {

    /**
     * Search Notes
     * @param query
     * @returns SearchNotesResponse Successful Response
     * @throws ApiError
     */
    public static searchNotes(
        query: string,
    ): CancelablePromise<SearchNotesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search_notes/',
            query: {
                'query': query,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
