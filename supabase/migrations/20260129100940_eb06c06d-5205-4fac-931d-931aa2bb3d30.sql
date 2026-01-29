-- Drop the comments and slide_changes tables since we're removing those features
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.slide_changes CASCADE;

-- Create presenter_notes table
CREATE TABLE public.presenter_notes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slide_id UUID NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint so each slide has only one notes record
ALTER TABLE public.presenter_notes ADD CONSTRAINT presenter_notes_slide_id_unique UNIQUE (slide_id);

-- Enable Row Level Security
ALTER TABLE public.presenter_notes ENABLE ROW LEVEL SECURITY;

-- Create public access policy (matching existing pattern)
CREATE POLICY "Public access for presenter_notes" ON public.presenter_notes
    AS RESTRICTIVE
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_presenter_notes_updated_at
    BEFORE UPDATE ON public.presenter_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Also update slides table to remove pending_agent_action since we don't need it
ALTER TABLE public.slides DROP COLUMN IF EXISTS pending_agent_action;