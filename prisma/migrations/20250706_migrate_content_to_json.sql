-- This migration adds default JSON content to existing rows with HTML content
-- This will safely handle the transition from HTML content to JSON for our Tiptap editor

-- Helper function to convert HTML to a simple JSON structure
CREATE OR REPLACE FUNCTION html_to_json(html_content TEXT) 
RETURNS JSONB AS $$
BEGIN
  -- Check if the content already appears to be JSON
  BEGIN
    -- Try to parse as JSON first
    RETURN html_content::jsonb;
  EXCEPTION WHEN OTHERS THEN
    -- If it fails, create a simple document with the HTML content
    RETURN jsonb_build_object(
      'type', 'doc',
      'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'attrs', jsonb_build_object('textAlign', null),
          'content', jsonb_build_array(
            jsonb_build_object(
              'type', 'text',
              'text', html_content
            )
          )
        )
      )
    );
  END;
END;
$$ LANGUAGE plpgsql;

-- Update Post content field
UPDATE "Post"
SET "content" = html_to_json("content"::text)
WHERE "content" IS NOT NULL;

-- Update Project content field
UPDATE "Project"
SET "content" = html_to_json("content"::text)
WHERE "content" IS NOT NULL;

-- Update Experience description field
UPDATE "Experience"
SET "description" = html_to_json("description"::text)
WHERE "description" IS NOT NULL;

-- Update About fullBio field
UPDATE "About"
SET "fullBio" = html_to_json("fullBio"::text)
WHERE "fullBio" IS NOT NULL;

-- Drop the helper function as it's no longer needed
DROP FUNCTION IF EXISTS html_to_json(TEXT);
