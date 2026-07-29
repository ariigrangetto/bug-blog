-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) & POLICIES FOR "Bugs" TABLE
-- Recommended by Supabase Security Best Practices
-- ====================================================================

-- 1. Enable RLS on the Bugs table
ALTER TABLE public."Bugs" ENABLE ROW LEVEL SECURITY;

-- 2. Revoke public direct table modifications (defense in depth)
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Bugs" TO authenticated;

-- 3. Policy: SELECT (Users can only view their own bugs)
DROP POLICY IF EXISTS "Users can view their own bugs" ON public."Bugs";
CREATE POLICY "Users can view their own bugs"
ON public."Bugs" FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = user_id );

-- 4. Policy: INSERT (Users can only insert bugs with their own user_id)
DROP POLICY IF EXISTS "Users can insert their own bugs" ON public."Bugs";
CREATE POLICY "Users can insert their own bugs"
ON public."Bugs" FOR INSERT
TO authenticated
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- 5. Policy: UPDATE (Requires both USING and WITH CHECK to prevent user_id reassignment)
DROP POLICY IF EXISTS "Users can update their own bugs" ON public."Bugs";
CREATE POLICY "Users can update their own bugs"
ON public."Bugs" FOR UPDATE
TO authenticated
USING ( (SELECT auth.uid()) = user_id )
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- 6. Policy: DELETE (Users can only delete their own bugs)
DROP POLICY IF EXISTS "Users can delete their own bugs" ON public."Bugs";
CREATE POLICY "Users can delete their own bugs"
ON public."Bugs" FOR DELETE
TO authenticated
USING ( (SELECT auth.uid()) = user_id );
