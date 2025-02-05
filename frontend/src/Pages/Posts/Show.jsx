import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';


const Show = () => {

  const { post_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(post_id)

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/payment/${post_id}`, {},  {
        withCredentials: true,
      });

      console.log('Payment success: ', res.data);
      const paymentUrl = res.data.redirectUrl;
      const newWindow = window.open(paymentUrl, '_blank');

      if (!newWindow) {
        alert('ポップアップがブロックされました。手動でリンクを開いてください: ' + paymentUrl);
      }

    } catch (error) {
      if (error.response) {
        console.error('Payment error response: ', error.respose.data);  // サーバーから返されたエラーレスポンス
      } else if (error.request) {
        console.error('Payment error request: ', error.request);  // リクエストが送信されたがレスポンスがなかった場合
      } else {
        console.error('Payment error: ', error.message);  // その他のエラー
      }
      setError('決済エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
    {loading ? 
      (
        <div>loading</div>
      )
      : 
      (
      <div>Show
      <p>{post_id}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handlePayment}>Payment</button>
      </div>
      )
     }
    </>

  )
}

export default Show