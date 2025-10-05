import { supabase } from '../lib/supabaseClient'

export default function TestPage({ data, error }) {
  if (error) return <div>❌ שגיאה: {error.message}</div>
  return (
    <div style={{ padding: 20 }}>
      <h1>בדיקת חיבור לסופבייס 🚀</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('test') // שנה כאן לשם הטבלה שלך
    .select('*')
    .limit(5)

  return {
    props: {
      data: data || null,
      error: error || null
    }
  }
}
