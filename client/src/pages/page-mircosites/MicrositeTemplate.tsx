import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  CreditCard,
  ShoppingBasket,
  Link,
  Store,
  HandCoins,
  MessageCircleQuestionMark,
  BriefcaseBusiness,
  Globe,
  Facebook,
  Instagram,
  Mail,
} from "lucide-react";
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
      <section className="max-w-lg mx-auto p-5">
        <Card className="p-4 rounded-3xl bg-white/90 backdrop-blur-3xl ">
          {/* Banner container */}
          <div className="relative w-full">
            <div
              className="w-full h-72 bg-cover bg-center bg-gray-100 rounded-2xl"
              style={{ backgroundImage: `url('${microsite.banner}')` }}
            >
              <a
                href={microsite.link}
                target="_blank"
                className="absolute p-2 right-0"
              >
                <Link size={35} className="p-1.5" />
              </a>
            </div>

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
            <div className="flex gap-2 items-center justify-center">
              <CardTitle className="font-bold text-3xl">
                {microsite.name}
              </CardTitle>
              
            </div>

            <CardDescription className="text-lg pt-4 mx-auto">
              {microsite.aboutDesc}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center p-0 ">
            {/* Socials Links */}
            <div className="flex justify-center items-center mx-auto gap-2 my-8  rounded-2xl w-fit">
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Facebook strokeWidth={1.5} />
                </a>
              </div>
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Instagram strokeWidth={1.5} />
                </a>
              </div>
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Globe strokeWidth={1.5} />
                </a>
              </div>
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Mail strokeWidth={1.5} />
                </a>
              </div>
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
                <div className="flex flex-col justify-between p-3">
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    <div className="text-left">
                      <h2 className="text-sm font-semibold">
                        Physical Gift Cards
                      </h2>
                      <p className="text-xs text-gray-700 mt-1 max-w-40">
                        Send a physical gift card to via post for 25, 50, 100 or
                        200 dollars!
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div>

              {/* Card 2 */}
              <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                <div className="flex flex-col justify-between p-3">
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Bulk Orders</h2>
                      <p className="text-sm text-gray-600 mt-1 max-w-45">
                        Have a large order or need custom values?
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div>

              {/* Card 3 */}
              {/* <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                <div className="flex flex-col justify-between p-3">
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Lorem Ipsum</h2>
                      <p className="text-sm text-gray-600 mt-1 w-45">
                        Reprehenderit Lorem fugiat laboris irure magna aliquip.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div> */}

              {/* Card 4 */}
              {/* <div className="w-full h-[190px] bg-gray-200 border rounded-3xl grid grid-cols-2 gap-4 overflow-hidden">
                <div className="flex flex-col justify-between p-3">
                  <div className="bg-primary rounded-full p-1.5 text-white w-fit">
                    <ShoppingBasket strokeWidth={1} size={18} />
                  </div>
                  <div>
                    <div className="text-left ">
                      <h2 className="text-sm font-semibold">Lorem Ipsum</h2>
                      <p className="text-sm text-gray-600 mt-1 w-45">
                        Reprehenderit Lorem fugiat laboris irure magna aliquip.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 ">
                      <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white rounded-xl text-sm">
                        Purchase here
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full bg-gray-400 rounded-3xl "></div>
              </div> */}
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

            <div className="grid grid-cols-2 gap-4 mt-4">
              <a
                href="https://www.whyleavetown.com/participating-stores/#participating_communities"
                target="_blank"
              >
                <div className="rounded-3xl bg-white/80 h-40 flex flex-col justify-center items-center gap-3">
                  <Store
                    size={40}
                    className="p-2 bg-primary text-white rounded-full"
                  />
                  <h2 className="text-lg text-secondary font-bold">
                    Check Stores
                  </h2>
                </div>
              </a>
              <a
                href="https://www.whyleavetown.com/check-card-balance/"
                target="_blank"
              >
                <div className="rounded-3xl bg-white/80 h-40 flex flex-col justify-center items-center gap-3">
                  <HandCoins
                    size={40}
                    className="p-2 bg-primary text-white rounded-full"
                  />
                  <h2 className="text-lg text-secondary font-bold">
                    My Points
                  </h2>
                </div>
              </a>
            </div>

            {/* Section Title */}
            <div className="section-title my-14 flex flex-col justify-center items-center text-center gap-3">
              <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                <MessageCircleQuestionMark strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl w-60">Frequently Asked Questions</h2>
            </div>

            {/* Accordion */}
            <Accordion
              type="single"
              collapsible
              className="w-full text-left bg-white/90 px-4 rounded-2xl"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md">
                  What is this microsite about?
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    This microsite highlights our business and the community
                    we’re proud to be part of. It’s designed to help you learn
                    more about what we offer and how we contribute to the local
                    area.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md">
                  How do I get a Why Leave Town Gift Card?{" "}
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    You can purchase a Why Leave Town Gift Card online or from
                    participating local outlets. The cards can be used at a wide
                    range of local stores and services — making it the perfect
                    way to support businesses in our region.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-md">
                  Where can I use my gift card?{" "}
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    Gift cards can be spent at any participating business
                    featured on this site. Look for the “Why Leave Town Gift
                    Cards Accepted Here” badge on listings, or check the full
                    list of businesses in the Where to Spend section.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-md">
                  How can I check my card balance?
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    Click the <strong>my points</strong> link on this website
                    and enter your card number. You’ll see your remaining
                    balance and expiry date instantly.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-md">
                  Can I feature my business like this
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    Absolutely! If you’re a local business owner and want to be
                    part of the platform, just get in touch at{" "}
                    <a
                      href="mailto:info@whyleavetown.com"
                      className="text-blue-600 hover:underline"
                    >
                      info@whyleavetown.com
                    </a>
                    . We’ll guide you through how to list your business and
                    promote what you offer.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Business Page */}
            <div className="section-title mt-14 flex flex-col justify-center items-center text-center gap-3">
              <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                <BriefcaseBusiness strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl w-60">Business Owners</h2>
              <p className="text-lg lg:px-10 text-gray-600 w-80">
                {microsite.aboutDesc}
              </p>
            </div>

            <Button variant="default" size="lg" className="w-fit mt-6">
              Register here
            </Button>

            {/* Socials Links */}
            <div className="flex justify-center items-center mx-auto gap-2 my-8  p-2 rounded-2xl w-fit">
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Facebook strokeWidth={1.5} />
                </a>
              </div>
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Instagram strokeWidth={1.5} />
                </a>
              </div>
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Globe strokeWidth={1.5} />
                </a>
              </div>
              <div className="w-15 h-12 bg-white rounded-xl flex items-center justify-center">
                <a href={microsite.facebook} target="_blank">
                  <Mail strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-white rounded-2xl py-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2 items-center">
                <img
                  src="/logo-whyleavetown.png"
                  alt=""
                  className="w-8 border rounded"
                />
                <p className="text-xs text-gray-600 w-35">
                  © 2025, WhyLeaveTown. All Rights Reserverd
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a href="https://whyleavetown.com/" target="_blank">
                  <Globe
                    strokeWidth={1.5}
                    size={28}
                    className="rounded-full p-1.5 bg-secondary text-white"
                  />
                </a>
                <a
                  href="https://www.facebook.com/whyleavetown/"
                  target="_blank"
                >
                  <Facebook
                    strokeWidth={1.5}
                    size={28}
                    className="rounded-full p-1.5 bg-secondary text-white"
                  />
                </a>
                <a
                  href="https://www.instagram.com/whyleavetown/?hl=en"
                  target="_blank"
                >
                  <Instagram
                    strokeWidth={1.5}
                    size={28}
                    className="rounded-full p-1.5 bg-secondary text-white"
                  />
                </a>
              </div>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
