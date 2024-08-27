// import { useSettings } from '../hooks';

// const yutoSettingsProps = useSettings();
// console.log(yutoSettingsProps);



// wp.hooks.addFilter( 'editor.PreSavePost', 'editor', ( edits ) => {
//     return edits.then( () => {
//       return Promise.reject( { message: "This is the error message." } );
//     } );
//   } );

import { useSettings } from '../hooks';

const { isSavingPost } = wp.data.select('core/editor');
const post_id = wp.data.select("core/editor").getCurrentPostId();

let checked = true;
wp.data.subscribe(() => {
    if (isSavingPost()) {
        checked = false;
    } else {
        if (!checked) {
            // const yutoSettingsProps = useSettings();
            // const {
            //     connectionInfo,
            //     UIDs,
            //     setUIDs,
            //     addDocuments,
            //     deleteIndex,
            //     documentAddingState,
            //     indexDeletingState
            // } = yutoSettingsProps
            // console.log(yutoSettingsProps)
            // Adding a log to understand when this runs.
            let currentDate = new Date();
            let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
            console.log(`
        ${time}
        Post is done saving via isSavingPost`, post_id);

            checked = true;
        }
    }
});