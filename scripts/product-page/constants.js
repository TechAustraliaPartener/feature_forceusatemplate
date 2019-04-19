/**
 * PREFIXES
 */

/**
 * All styling CSS classes should have the CSS_PREFIX
 */
export const CSS_PREFIX = 'de-';
/**
 * All JS-bound CSS classes should have the JS_PREFIX
 */
export const JS_PREFIX = `js-${CSS_PREFIX}`;

/**
 * CSS Classes
 */

/**
 * The CSS class used to update the UI to an "active" state
 */
export const IS_ACTIVE_CLASS = `${CSS_PREFIX}is-active`;

/**
 * The CSS class used on links to upvote or downvote a review or answer
 */
export const REVIEW_VOTE_CLASS = `${JS_PREFIX}CustomerReviewVote`;

/**
 * The CSS class on the button used to get more reviews
 */
export const MORE_REVIEWS_CLASS = `${JS_PREFIX}moreReviews`;

/**
 * Reusable values
 */

/**
 * Multiplier for converting stars to a percentage
 */
export const STAR_RATING_PERCENTAGE_MULTIPLIER = 20;

/**
 * Base URL for querying the Decathlon Reviews API
 */
export const REVIEWS_BASE_URL =
  'https://reviews.decathlon.com/api/en_US/review/list';

const REVIEWS_DEFUAULT_NUMBER_PER_PAGE = 5;

/**
 * Base query parameters for the Decathlon Reviews API
 */
export const REVIEWS_BASE_QUERY_PARAMS = {
  site: 1132,
  type: 1,
  locales: 'en',
  nb: REVIEWS_DEFUAULT_NUMBER_PER_PAGE
};
