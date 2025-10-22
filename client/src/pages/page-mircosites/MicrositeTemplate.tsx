import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { CreditCard, ShoppingBasket } from "lucide-react";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (microsite?.name) {
      document.title = `${microsite.name} | Microsite`;
    }
  }, [microsite]);

  if (!microsite)
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerCustom />
      </div>
    );

  return (
    <div
      className="relative max-w-full mx-auto overflow-hidden bg-cover bg-center "
      style={{
        backgroundImage: `url(${microsite.banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <section className="max-w-lg mx-auto p-3 md:p-5 ">
        <Card className="p-3 rounded-3xl bg-white/30 backdrop-blur-3xl">
          {/* Banner container */}
          <div className="relative w-full">
            <div
              className="w-full h-72 bg-cover bg-center bg-gray-100 rounded-2xl"
              style={{ backgroundImage: `url('${microsite.banner}')` }}
            />

            {/* Logo overlapping the bottom of banner */}
            <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
              <img
                src={microsite.logo}
                alt={microsite.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          <CardHeader className="text-center mt-12">
            <CardTitle className="font-bold text-3xl">
              {microsite.name}
            </CardTitle>
            <CardDescription className="text-lg lg:px-10 pt-4">
              {microsite.aboutDesc}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center p-0">
            {/* Socials Links */}
            <div className="flex justify-center items-center gap-2 my-8">
              <div className="w-20 h-10 bg-gray-100 rounded-md"></div>
              <div className="w-20 h-10 bg-gray-100 rounded-md"></div>
              <div className="w-20 h-10 bg-gray-100 rounded-md"></div>
              <div className="w-20 h-10 bg-gray-100 rounded-md"></div>
            </div>

            {/* Section Title */}
            <div className="section-title my-14 flex flex-col justify-center items-center text-center gap-3">
              <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                <CreditCard strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl ">Purchase Cards</h2>
            </div>

            {/* Purchase Cards */}
            <div className="space-y-4">
              {/* Card 1 */}
              <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                {/* Left Section */}
                <div className="flex flex-col justify-between p-3">
                  {/* Top Icon */}
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    {/* Text Content */}{" "}
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Lorem Ipsum</h2>
                      <p className="text-sm text-gray-600 mt-1 w-45">
                        Reprehenderit Lorem fugiat laboris irure magna aliquip.
                      </p>
                    </div>
                    {/* Bottom Buttons */}
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                {/* Right Image Section */}
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div>

              {/* Card 2 */}
              <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                {/* Left Section */}
                <div className="flex flex-col justify-between p-3">
                  {/* Top Icon */}
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    {/* Text Content */}{" "}
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Lorem Ipsum</h2>
                      <p className="text-sm text-gray-600 mt-1 w-45">
                        Reprehenderit Lorem fugiat laboris irure magna aliquip.
                      </p>
                    </div>
                    {/* Bottom Buttons */}
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                {/* Right Image Section */}
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div>

              {/* Card 3 */}
              <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                {/* Left Section */}
                <div className="flex flex-col justify-between p-3">
                  {/* Top Icon */}
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    {/* Text Content */}{" "}
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Lorem Ipsum</h2>
                      <p className="text-sm text-gray-600 mt-1 w-45">
                        Reprehenderit Lorem fugiat laboris irure magna aliquip.
                      </p>
                    </div>
                    {/* Bottom Buttons */}
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                {/* Right Image Section */}
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div>

              {/* Card 4 */}
              <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                {/* Left Section */}
                <div className="flex flex-col justify-between p-3">
                  {/* Top Icon */}
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    {/* Text Content */}{" "}
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Lorem Ipsum</h2>
                      <p className="text-sm text-gray-600 mt-1 w-45">
                        Reprehenderit Lorem fugiat laboris irure magna aliquip.
                      </p>
                    </div>
                    {/* Bottom Buttons */}
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                {/* Right Image Section */}
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div>
            </div>

            {/* Section Title */}
            <div className="section-title my-14 flex flex-col justify-center items-center text-center gap-3">
              <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                <CreditCard strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl w-60">Where can I use my Gift Card?</h2>
            </div>

            {/* Map Section / Google Map Embed */}
            <div className="w-full h-[400px] bg-gray-400 rounded-3xl overflow-hidden">
              {/* <MapCard mapLink={microsite.mapLink} /> */}
              <iframe
                className="w-full h-full"
                src={microsite.mapLink}
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
