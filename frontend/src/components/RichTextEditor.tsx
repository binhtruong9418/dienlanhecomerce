import React from 'react';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    height?: number;
    onImageUpload: (file: File) => Promise<string | null>;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    id,
    placeholder,
    height = 500,
    onImageUpload
}) => {
    const uploadImage = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            throw new Error('Only image uploads are allowed');
        }
        const url = await onImageUpload(file);
        if (!url) throw new Error('Failed to get url from image upload');
        return url;
    };

    return (
        <Editor
            // Commenting out local script source to use default CDN or require explicit local config
            tinymceScriptSrc='/tinymce/tinymce.min.js'
            apiKey="g5wga0u20mm5h6pajqis0966oyqdoj2cs75mkjbof62brstm"
            id={id}
            value={value}
            onEditorChange={(content) => onChange(content)}
            init={{
                height,
                menubar: false,
                licenseKey: 'gpl',

                // All available free plugins
                plugins: [
                    'advlist',           // Advanced list styles
                    'anchor',            // Insert anchors
                    'autolink',          // Auto-convert URLs to links
                    'autosave',          // Auto-save content
                    'charmap',           // Special characters
                    'code',              // View/edit HTML source
                    'codesample',        // Code syntax highlighting
                    'directionality',    // Text direction (LTR/RTL)
                    'fullscreen',        // Fullscreen mode
                    'help',              // Help dialog
                    'image',             // Insert images
                    'importcss',         // Import CSS
                    'insertdatetime',    // Insert date/time
                    'link',              // Insert links
                    'lists',             // Bullet and numbered lists
                    'media',             // Embed media (video/audio)
                    'nonbreaking',       // Insert non-breaking space
                    'pagebreak',         // Insert page break
                    'preview',           // Preview content
                    'quickbars',         // Quick toolbars on selection
                    'save',              // Save button
                    'searchreplace',     // Find and replace
                    'table',             // Insert tables
                    'visualblocks',      // Show block elements
                    'visualchars',       // Show invisible characters
                    'wordcount'          // Word count
                ],

                // Enhanced toolbar with all features
                toolbar: [
                    'undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor',
                    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
                    'link image media table codesample charmap insertdatetime | code fullscreen preview help'
                ].join(' | '),

                // Toolbar mode (floating, sliding, scrolling, wrap)
                toolbar_mode: 'sliding',

                // Quick toolbars (appear on selection)
                quickbars_selection_toolbar: 'bold italic underline | blocks | quicklink blockquote',
                quickbars_insert_toolbar: 'quickimage quicktable',

                // Advanced list options
                advlist_bullet_styles: 'default,circle,square',
                advlist_number_styles: 'default,lower-alpha,lower-roman,upper-alpha,upper-roman',

                // Font options
                font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre; Code=code',

                // Image settings
                image_advtab: true,
                image_caption: true,
                image_title: true,
                automatic_uploads: true,

                // Table settings
                table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                table_appearance_options: true,
                table_advtab: true,
                table_cell_advtab: true,
                table_row_advtab: true,

                // Link settings
                link_assume_external_targets: true,
                link_title: false,
                default_link_target: '_blank',

                // Code sample languages
                codesample_languages: [
                    { text: 'HTML/XML', value: 'markup' },
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'TypeScript', value: 'typescript' },
                    { text: 'CSS', value: 'css' },
                    { text: 'PHP', value: 'php' },
                    { text: 'Python', value: 'python' },
                    { text: 'Java', value: 'java' },
                    { text: 'C', value: 'c' },
                    { text: 'C#', value: 'csharp' },
                    { text: 'C++', value: 'cpp' },
                    { text: 'Ruby', value: 'ruby' },
                    { text: 'Go', value: 'go' },
                    { text: 'Rust', value: 'rust' },
                    { text: 'SQL', value: 'sql' },
                    { text: 'JSON', value: 'json' }
                ],

                // Content settings
                branding: false,
                promotion: false,
                relative_urls: false,
                remove_script_host: false,
                forced_root_block: 'p',
                element_format: 'html',

                // Paste settings
                paste_as_text: false,
                smart_paste: true,

                // Autosave settings (saves to localStorage)
                autosave_interval: '30s',
                autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
                autosave_restore_when_empty: true,
                autosave_retention: '30m',

                // Additional settings
                placeholder,
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 14px; line-height: 1.6; }',

                // File picker for images
                file_picker_types: 'image',
                file_picker_callback: (cb) => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        try {
                            const url = await uploadImage(file);
                            cb(url, { title: file.name });
                        } catch (error: any) {
                            console.error(error);
                            toast.error(error?.message || 'Failed to upload image');
                        }
                    };
                    input.click();
                },

                // Image upload handler
                images_upload_handler: async (blobInfo) => {
                    try {
                        const file: any = blobInfo.blob();
                        const url = await uploadImage(file);
                        return url;
                    } catch (error: any) {
                        console.error(error);
                        toast.error(error?.message || 'Failed to upload image');
                        throw error;
                    }
                }
            }}
        />
    );
};

export default RichTextEditor;
