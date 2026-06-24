
CREATE POLICY "Users upload own memory photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'memories' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own memory photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'memories' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own memory photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'memories' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Public read memory photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'memories');
