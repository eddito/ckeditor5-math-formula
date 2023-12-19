( function() {

// createDialog().then( config => {
// 	return ClassicEditor
// 		.create( document.querySelector( '.editor' ))
// 		.then( editor => {
// 			window.editor = editor;
// 		} )
// 		.catch( handleSampleError );
// } );
function createDialog() {
	ClassicEditor
		.create( document.querySelector( '.editor' ))
		.then( editor => {
			window.editor = editor;
		} )
		.catch( handleSampleError );
}
function handleSampleError( error ) {
	const issueUrl = 'https://github.com/ckeditor/ckeditor5/issues';

	const message = [
		'Oops, something went wrong!',
		`Please, report the following error on ${ issueUrl } with the build id "imj8bzi6v40l-ht9auum6gsk1" and the error stack trace:`
	].join( '\n' );

	console.error( message );
	console.error( error );
}
   createDialog()
}() );
