/* External dependencies */
import { select } from "@wordpress/data";

/* Internal dependencies */
import * as actions from "./actions";

/**
 * Default API query parameters.
 *
 * The @wordpress/api-fetch library has middleware that will retrieve all entries for a collection
 * if per_page=-1 is specified, because the limit for WordPress API endpoints is 100 items per request.
 */
const DEFAULT_PARAMS = {
	/* eslint-disable-next-line camelcase */
	per_page: -1,
};

/**
 * Api request base.
 */
const REST_BASE = "/wp/v2";

/**
 * Turns an object into query params.
 *
 * @param {Object} params Key value pairs representing query parameters.
 *
 * @returns {string} Query string.
 */
function buildQueryString( params = {} ) {
	const mergedParams = {
		...DEFAULT_PARAMS,
		...params,
	};

	return Object
		.keys( mergedParams )
		.map( key => ( `${ key }=${ mergedParams[ key ] }` ) )
		.join( "&" );
}

/**
 * Resolver for retrieving a list of terms.
 *
 * @param {string} taxonomySlug Taxonomy slug.
 *
 * @returns {Object} Action object.
 */
export function* getTerms( taxonomySlug ) {
	const taxonomy = select( "yoast-seo/wp-data" ).getTaxonomy( taxonomySlug );

	if ( ! taxonomy ) {
		return;
	}

	const terms = yield actions.fetchFromAPI( {
		path: `${ REST_BASE }/${ taxonomy.rest_base }?${ buildQueryString() }`,
	} );

	return actions.setTerms( { taxonomySlug, terms } );
}

/**
 * Resolver for retrieving a list of taxonomies.
 *
 * @param {string} postType The post type.
 *
 * @returns {Object} Action object.
 */
export function* getTaxonomies( postType ) {
	const taxonomies = yield actions.fetchFromAPI( {
		path: `${ REST_BASE }/taxonomies?${ buildQueryString( { type: postType } ) }`,
	} );

	return actions.setTaxonomies( taxonomies );
}
