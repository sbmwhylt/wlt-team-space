import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MicrositeTemplate() {
  const { slug } = useParams();
  const [microsite, setMicrosite] = useState<any>(null);

  useEffect(() => {
    const fetchMicrosite = async () => {
      if (!slug) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/microsites/${encodeURIComponent(
            slug
          )}`
        );
        setMicrosite(res.data.microsite);
      } catch (err) {
        console.error("Error fetching microsite:", err);
      }
    };

    fetchMicrosite();
  }, [slug]);
  if (!microsite) return <p>Loading...</p>;

  return (
    <>
      <div>Microsite Template</div>
      <div>{microsite.name}</div>;
    </>
  );
}
