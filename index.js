var dmp = require('diff_match_patch')
    , engine = new dmp.diff_match_patch

var sync = {

    send: function( text, callback )
    {
        if ( !this.prev ) this.prev = '';

        var diff = engine.diff_main(this.prev, text, false);

        if (diff.length > 2) {
            engine.diff_cleanupSemantic(diff);
        }

        var patch_list = engine.patch_make(this.prev, text, diff);
        patch_text = engine.patch_toText(patch_list);

        this.prev = text;

        if ( callback )
        {
            return callback(patch_text);
        }
        else
            return patch_text;
    },
    recv: function( current, patch, callback )
    {
        current = decodeURI(current);

        if ( !patch )
        {
            this.prev = current;
            return this.prev;
        }

        patch = decodeURI(patch);

        var patches = engine.patch_fromText(patch);
        var results = engine.patch_apply(patches, current || '');

        this.prev = results[0];

        for (var x = 0; x < results.length; x++) {
            if (!results[x]) {
                console.log('patch failed');
            }
        }

        if ( callback )
        {
            return callback(this.prev);
        }
        else
            return this.prev;
    }
};

module.exports = sync;
