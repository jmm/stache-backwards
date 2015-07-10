var
  set = require('lodash/object/set'),
  escapers = {};

exports.handlebars = {};

escapers.html = require('escape-html');

exports.handlebars.helper = helper;

/**
 * Handlebars helper.
 * For manually interacting with handlebars instead of using `extract`.
 */
function helper (helperOpts) {
  return function helper (context, blockOpts) {
    blockOpts = blockOpts || context;

    var
      val = blockOpts.fn();

    if (blockOpts.hash.escape) {
      val = escapers[blockOpts.hash.escape](val);
    }

    if (blockOpts.hash.path !== undefined) {
      set(
        helperOpts.target,
        blockOpts.hash.path,
        val
      );
    }
    else helperOpts.target[blockOpts.hash.key] = val;
  };
}
// helper

exports.handlebars.extract = extract;

/**
 * Extracts content from a template.
 *
 * @param object opts Options
 * @param object|undefined opts.handlebars Instance of handlebars to use.
 * @param string|function opts.template Template to extract from. String or
 *   return value of handlebars.compile().
 * @param object|undefined opts.target Object to populate with content.
 * @param string|undefined opts.blockName Name of the handlebars block (helper).
 * @return object Hash of the content.
 */
function extract (opts) {
  opts = opts || {};
  var
    engine = opts.handlebars || require('handlebars'),
    template = opts.template,
    target = opts.target || {};

  engine.registerHelper(opts.blockName || 'content', helper({
    target: target,
  }));

  if (typeof template === 'string') template = engine.compile(template);

  template();

  return target;
}
// extract
