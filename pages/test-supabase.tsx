import { supabase } from '../lib/supabaseClient'

type Props = {
  data: any;
  error: any;
};

export default function TestPage({ data, error }: Props) {
  if (error) return <div>❌ שגיאה: {error.message}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 בדיקת חיבור ל־Supabase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('real_estate_listings') // שנה כאן אם שם הטבלה שונה
    .select('*')
    .limit(5);

  return {
    props: {
      data: data || null,
      error: error || null,
    },
  };
}
