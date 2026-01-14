import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { MicroSite } from "@/types/Microsite";
import { SocialIcon } from "react-social-icons";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  CreditCard,
  ShoppingBasket,
  Store,
  HandCoins,
  MessageCircleQuestionMark,
  BriefcaseBusiness,
  Globe,
  Facebook,
  Instagram,
  Palette,
  Mail,
  Phone,
  CircleOff,
} from "lucide-react";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import UpdateContactForm from "@/pages/page-mircosites/forms/UpdateContactForm";
import UpdateTerminalForm from "@/pages/page-mircosites/forms/UpdateTerminalForm";
import CardStockForm from "@/pages/page-mircosites/forms/CardStockForm";

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  );
}
export default function MicrositeTemplate() {
  const { slug, type } = useParams();
  const [microsite, setMicrosite] = useState<MicroSite | null>(null);

  useEffect(() => {
    const fetchMicrosite = async () => {
      if (!slug || !type) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/microsites/${encodeURIComponent(
            type
          )}/${encodeURIComponent(slug)}`
        );
        setMicrosite(res.data.microsite);
      } catch (err) {
        console.error("Error fetching microsite:", err);
      }
    };
    fetchMicrosite();
  }, [slug, type]);

  useEffect(() => {
    if (microsite?.name) {
      document.title = `${microsite.name} | ${microsite.type}`;
    }
  }, [microsite]);

  if (!microsite)
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerCustom />
      </div>
    );

  const icons = {
    facebook: (
      <SocialIcon
        network="facebook"
        style={{ height: 24, width: 24, color: "green" }}
      />
    ),
    instagram: (
      <SocialIcon network="instagram" style={{ height: 24, width: 24 }} />
    ),
    x: <SocialIcon network="x" style={{ height: 24, width: 24 }} />,
    website: (
      <Globe
        strokeWidth={1.5}
        size={24}
        className="text-white p-1 rounded-full bg-purple-500"
      />
    ),
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background layer (blurred image) */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl scale-105"
        style={{
          backgroundImage: `url(${microsite.banner})`,
        }}
      />

      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-black/30" />
      <section className="max-w-lg mx-auto p-5">
        <Card className="p-4 rounded-3xl bg-white/65 backdrop-blur-2xl ">
          {/* Banner container */}
          <div className="relative w-full">
            <div
              className="w-full h-72 bg-cover bg-center bg-gray-100 rounded-2xl"
              style={{ backgroundImage: `url('${microsite.banner}')` }}
            ></div>

            {/* Logo overlapping the bottom of banner */}
            <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
              <img
                src="/logo-whyleavetown.png"
                alt="Why Leave Town Logo"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>
          <CardHeader className="text-center mt-12">
            <CardTitle className="font-bold text-3xl">
              {microsite.name}
            </CardTitle>

            <CardDescription className="text-lg pt-4  text-gray-700">
              {microsite.aboutDesc}
            </CardDescription>
          </CardHeader>
          {microsite.type === "business" && (
            <div className="section-title mt-6 flex flex-col justify-center items-center text-center gap-3">
              <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                <CircleOff strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl ">Had a Card Decline?</h2>
            </div>
          )}
          {microsite.type === "business" && (
            <Accordion
              type="single"
              collapsible
              className="w-full text-left bg-white/90 px-4 rounded-2xl mt-4"
              defaultValue="item-1"
            >
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md">
                  Insufficient funds on gift card{" "}
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <div className="text-gray-700 text-md space-y-3">
                    <p>
                      If a transaction is declined due to insufficient funds, it
                      generally means that the total amount being spent exceeds
                      the available balance on the gift card.
                    </p>
                    <p>
                      For example, if the customer has a $200 balance on their
                      gift card but attempts to make a purchase of $250, the
                      transaction will not go through, as the funds on the card
                      are insufficient to cover the total amount.
                    </p>
                    <p>
                      Another common issue arises when a surcharge is
                      automatically added to the transaction. For example: If
                      the transaction amount is $100, but your terminal
                      automatically adds a 2% surcharge (which would be $2), the
                      total amount the customer needs to pay is $102.
                    </p>
                    <p>
                      If the customer is using a $100 gift card, the $102 total
                      would exceed the available balance on the card, causing
                      the transaction to decline. To see what value is on the
                      gift card click{" "}
                      <span>
                        <a
                          href="https://www.whyleavetown.com/check-card-balance/"
                          className="text-blue-600 underline"
                          target="_blank"
                        >
                          here.
                        </a>
                      </span>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-md">
                  Terminal not authorised
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    This issue is related to your terminal not being in our
                    network. Maybe you recently installed new terminals, or
                    there has been a bank update. To resolve this issue please
                    work through the terminal activation process mentioned
                    further down on this page (under Program Operations).
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-md">
                  Terminal Not Reading
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <div className="text-gray-700 text-md space-y-4">
                    <p>
                      If a transaction fails because the terminal isn’t reading
                      the card, there could be several reasons behind this. Here
                      are some of the most common causes:
                    </p>
                    <ol className="list-decimal pl-5">
                      <li>
                        <strong>Incorrect process</strong>: Before swiping the
                        card, the purchase amount must be typed into the
                        terminal, and the enter button pressed. Only after this
                        is completed, should the card be swiped.
                      </li>
                      <li>
                        <strong>Terminal compatibility:</strong>
                        Some terminals, like Square, are not compatible with
                        EFTPOS Swipe gift cards (i.e. the type of card we use
                        for the physical version of the gift card). If you're
                        using a terminal that doesn't support these cards, the
                        swipe won't register, and therefore the cards cannot be
                        redeemed. For further information on Square related
                        issues, please refer to this section below.
                      </li>
                      <li>
                        <strong>Damaged terminal:</strong>
                        If the card is not reading when swiped, it may be
                        because the terminal’s swipe functionality isn’t working
                        properly. This could be be due to a technical issue,
                        such as a damaged or faulty terminal, or because the
                        swipe functionality on your terminal has not been
                        activated. To resolve any of these issues, please
                        contact your terminal provider.
                      </li>
                      <li>
                        <strong>Magnetic strip damage:</strong>
                        Another reason for cards not swiping properly is because
                        the magnetic strip on the gift card may be damaged. This
                        can happen if the card has been scratched, bent, or
                        exposed to extreme conditions. If you suspect a damaged
                        magnetic strip, please encourage the card holder to
                        contact WLT{" "}
                        <span>
                          <a
                            href="https://www.whyleavetown.com/contact-us-here/"
                            className="text-blue-600 underline"
                            target="_blank"
                          >
                            here.
                          </a>
                        </span>
                      </li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-md">
                  Incorrect PIN
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <div className="text-gray-700 text-md space-y-4">
                    <p>
                      If the transaction is declined due to an incorrect PIN,
                      it’s usually because the wrong PIN was entered. This can
                      happen if a customer accidentally presses a wrong digit.
                    </p>
                    <p>
                      <strong>Tip:</strong> Double-check the PIN located on the
                      back of the card and take care when re-entering. Please be
                      aware that if the wrong pin is entered on more than 3
                      occasions, the card will be disabled for security reasons.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-md">
                  Expired Card
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    If you{" "}
                    <span>
                      <a href="https://www.whyleavetown.com/check-card-balance/">
                        check the card’s balance{" "}
                      </a>
                    </span>
                    and receive the message “The given credentials are invalid”,
                    it likely means the card has expired. In line with
                    government legislation, a card expires three years after the
                    purchase date, and it can therefore no longer be used.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-md">
                  All other declines
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-gray-700 text-md">
                    If all of the above reasons for cards declining have been
                    considered and you are still experiencing issues, please
                    contact WLT for further assistance{" "}
                    <span>
                      <a
                        href="https://www.whyleavetown.com/contact-us-here/"
                        className="underline text-blue-500"
                      >
                        here.
                      </a>
                    </span>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {/* Accordion */}
          {microsite.type === "consumer" && (
            <div className="flex justify-center items-center gap-2 mt-5">
              {Object.entries(microsite.socialLinks || {}).map(
                ([platform, url]) => {
                  const typedPlatform = platform as keyof typeof icons;
                  const hasLink = typeof url === "string" && url;

                  return (
                    <a
                      key={platform}
                      href={hasLink ? url : undefined}
                      target={hasLink ? "_blank" : undefined}
                      rel={hasLink ? "noopener noreferrer" : undefined}
                      className={`group relative 
                        p-2 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl border-2 ${
                          hasLink
                            ? ":scale-105  cursor-pointer"
                            : "border-gray-100 opacity-50 cursor-default"
                        }`}
                    >
                      <div
                        className={`transition-all duration-300 ${
                          hasLink
                            ? "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
                            : "text-gray-400"
                        }`}
                      >
                        {icons[typedPlatform] ?? null}
                      </div>
                    </a>
                  );
                }
              )}
              <a
                href={microsite.email ? `mailto:${microsite.email}` : undefined}
                className={`group p-2 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${
                  microsite.email
                    ? "hover:shadow-2xl text-gray-600 hover:text-blue-600 cursor-pointer"
                    : "border-gray-100 opacity-50 cursor-default"
                }`}
              >
                <Mail
                  strokeWidth={2}
                  size={24}
                  className={`p-1 rounded-full bg-red-400 text-white transition-transform duration-300 ${
                    microsite.email ? "group-hover:scale-110" : ""
                  }`}
                />
              </a>
              <a
                href={microsite.phone ? `tel:${microsite.phone}` : undefined}
                className={`group p-2 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${
                  microsite.phone
                    ? "hover:shadow-2xl text-gray-600 hover:text-blue-600 cursor-pointer"
                    : "border-gray-100 opacity-50 cursor-default"
                }`}
              >
                <Phone
                  strokeWidth={0}
                  size={24}
                  fill="currentColor"
                  className={`p-1 rounded-full bg-emerald-400 text-white transition-transform duration-300 ${
                    microsite.phone ? "group-hover:scale-110" : ""
                  }`}
                />
              </a>
            </div>
          )}
          <CardContent className="text-center p-0 ">
            {/* Section Title */}
            <div className="section-title my-14 flex flex-col justify-center items-center text-center gap-3">
              <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                <CreditCard strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl ">Purchase Cards</h2>
            </div>

            {/* Purchase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="group relative bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={
                      microsite.physicalImg ||
                      "https://ik.imagekit.io/wlt/wlt-static-imgs/physical.png"
                    }
                    alt="Physical Card"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full p-2 text-white shadow-lg">
                    <ShoppingBasket strokeWidth={1.5} size={18} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Physical Gift Cards
                    </h2>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      Send a physical gift card via post for $25, $50, $100 or
                      $200
                    </p>
                  </div>

                  <a
                    href={microsite.physicalCardOrderLink}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-400 hover:to-red-500 transition-all px-4 py-2.5 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Purchase Now
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={
                      microsite.physicalBulkImg ||
                      "https://ik.imagekit.io/wlt/wlt-static-imgs/bulk-physical.png?updatedAt=1767672636033"
                    }
                    alt="Bulk Physical"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full p-2 text-white shadow-lg">
                    <ShoppingBasket strokeWidth={1.5} size={18} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Physical Bulk Orders
                    </h2>
                    <p className="text-xs text-gray-600 mt-1.5">
                      Large orders or need custom values?
                    </p>
                  </div>

                  <a
                    href="https://www.whyleavetown.com/bulk-card-orders/"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-400 hover:to-red-500 transition-all px-4 py-2.5 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Purchase Now
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-white border-2 border-purple-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={
                      microsite.digitalImg ||
                      "https://ik.imagekit.io/wlt/wlt-static-imgs/digital.png?updatedAt=1767672636048"
                    }
                    alt="Digital Card"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full p-2 text-white shadow-lg">
                    <ShoppingBasket strokeWidth={1.5} size={18} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Digital Gift Cards
                    </h2>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      Instant delivery via SMS for $25, $50, $100 or $200
                    </p>
                  </div>

                  <a
                    href={microsite.digitalCardOrderLink}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-400 hover:to-red-500 transition-all px-4 py-2.5 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Purchase Now
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={
                      microsite.digitalBulkImg ||
                      "https://ik.imagekit.io/wlt/wlt-static-imgs/bulk-digital.png?updatedAt=1767672636330"
                    }
                    alt="Bulk Digital"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full p-2 text-white shadow-lg">
                    <ShoppingBasket strokeWidth={1.5} size={18} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Digital Bulk Orders
                    </h2>
                    <p className="text-xs text-gray-600 mt-1.5">
                      Large orders or need custom values?
                    </p>
                  </div>

                  <a
                    href="https://www.whyleavetown.com/bulk-digital-card-orders/"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-400 hover:to-red-500 transition-all px-4 py-2.5 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Purchase Now
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
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
            {microsite.type === "consumer" && (
              <div className="w-full h-[400px] bg-gray-400 rounded-3xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={microsite.mapLink}
                  loading="lazy"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <a
                href={microsite.communityLink}
                target="_blank"
                className="group"
              >
                <div className="relative rounded-3xl bg-gradient-to-br from-white to-gray-50 h-44 flex flex-col justify-center items-center gap-4 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Store
                        size={26}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h2 className="text-base font-bold text-gray-900 text-center px-6  transition-colors">
                      Where to spend the gift card?
                    </h2>
                  </div>
                </div>
              </a>

              <a
                href="https://www.whyleavetown.com/check-card-balance/"
                target="_blank"
                className="group"
              >
                <div className="relative rounded-3xl bg-gradient-to-br from-white to-gray-50 h-44 flex flex-col justify-center items-center gap-4 border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <HandCoins
                        size={26}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h2 className="text-base font-bold text-gray-900 text-center px-6 transition-colors">
                      Check card balance or expiry?
                    </h2>
                  </div>
                </div>
              </a>
            </div>

            {microsite.type === "business" && (
              // Section Title
              <div className="section-title my-14 flex flex-col justify-center items-center text-center gap-3">
                <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                  <Palette strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl w-60">Marketing Material</h2>
                <p className="text-gray-700 max-w-sm text-lg">
                  A dedicated space showcasing ready-to-use marketing materials,
                  brand assets, and promotional resources—designed to keep
                  messaging consistent, on-brand, and easy to deploy across
                  channels.
                </p>
              </div>
            )}

            {microsite.type === "business" && (
              <div className="w-full mb-4">
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent className="">
                    {microsite.marketingImgs?.map((img, index) => (
                      <CarouselItem key={index} className="pl-4">
                        <div className="p-0">
                          <div className="relative w-full h-full p-4">
                            <img
                              src={img}
                              alt={`Marketing image ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className="flex justify-center items-center gap-4 mt-6">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </Carousel>
              </div>
            )}

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
                    Click the <strong>check card balance above</strong> link on
                    this website and enter your card number. You’ll see your
                    remaining balance and expiry date instantly.
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

            <div className="flex justify-center gap-1 mt-4">
              <a
                href="https://www.whyleavetown.com/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-6 py-2.5 bg-white border-2 border-gray-300 rounded-xl font-medium text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">View more FAQ</span>
              </a>

              <a
                href="https://www.whyleavetown.com/terms-and-conditions/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-6 py-2.5 bg-white border-2 border-gray-300 rounded-xl font-medium text-sm text-gray-700 hover:border-purple-500 hover:text-purple-600 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Terms & Conditions</span>
              </a>
            </div>

            {/* Business Page */}
            {microsite.type === "business" ? (
              <>
                <div className="section-title mt-14 flex flex-col justify-center items-center text-center gap-3">
                  <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                    <BriefcaseBusiness strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl w-60">Program Operations</h2>
                  <p className="text-lg lg:px-10 text-gray-600 ">
                    Forms used to update, modify, and maintain program
                    details—covering changes to schedules, configurations,
                    requirements, and other operational information to keep
                    programs accurate and up to date.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="section-title mt-14 flex flex-col justify-center items-center text-center gap-3">
                  <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                    <BriefcaseBusiness strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl w-60">Business Owners</h2>
                  <p className="text-lg lg:px-10 max-w-xl text-gray-700">
                    Do you want to accept the{" "}
                    <span className="text-blue-600 font-medium">
                      {microsite.name}
                    </span>{" "}
                    Gift Card at your business? Join the Why Leave Town network
                    today and start attracting more local customers while
                    supporting your community.
                  </p>
                </div>
              </>
            )}

            {microsite.type === "business" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg" className="w-fit mt-6">
                    Update forms
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader className="mx-auto text-center">
                    {/* <div className="rounded-full bg-primary text-white w-fit flex items-center justify-center p-2">
                    <Zap strokeWidth={1.5} />
                  </div> */}
                    <DialogDescription className="text-2xl text-black">
                      What needs an update?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default">Contact Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <UpdateContactForm />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default">Terminal Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <UpdateTerminalForm />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default">Card Stocks</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <CardStockForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {microsite.type === "consumer" && (
              <a
                href={microsite.businessLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="default"
                  size="lg"
                  className="w-fit mt-6 cursor-pointer"
                >
                  Go to form
                </Button>
              </a>
            )}

            {/* Social Links */}
            {microsite.type === "consumer" && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {Object.entries(microsite.socialLinks || {}).map(
                  ([platform, url]) => {
                    const typedPlatform = platform as keyof typeof icons;
                    const hasLink = typeof url === "string" && url;

                    return (
                      <a
                        key={platform}
                        href={hasLink ? url : undefined}
                        target={hasLink ? "_blank" : undefined}
                        rel={hasLink ? "noopener noreferrer" : undefined}
                        className={`group relative 
                        p-2 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl border-2 ${
                          hasLink
                            ? ":scale-105  cursor-pointer"
                            : "border-gray-100 opacity-50 cursor-default"
                        }`}
                      >
                        <div
                          className={`transition-all duration-300 ${
                            hasLink
                              ? "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
                              : "text-gray-400"
                          }`}
                        >
                          {icons[typedPlatform] ?? null}
                        </div>
                      </a>
                    );
                  }
                )}
                <a
                  href={
                    microsite.email ? `mailto:${microsite.email}` : undefined
                  }
                  className={`group p-2 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${
                    microsite.email
                      ? "hover:shadow-2xl text-gray-600 hover:text-blue-600 cursor-pointer"
                      : "border-gray-100 opacity-50 cursor-default"
                  }`}
                >
                  <Mail
                    strokeWidth={2}
                    size={24}
                    className={`p-1 rounded-full bg-red-400 text-white transition-transform duration-300 ${
                      microsite.email ? "group-hover:scale-110" : ""
                    }`}
                  />
                </a>
                <a
                  href={microsite.phone ? `tel:${microsite.phone}` : undefined}
                  className={`group p-2 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${
                    microsite.phone
                      ? "hover:shadow-2xl text-gray-600 hover:text-blue-600 cursor-pointer"
                      : "border-gray-100 opacity-50 cursor-default"
                  }`}
                >
                  <Phone
                    strokeWidth={0}
                    size={24}
                    fill="currentColor"
                    className={`p-1 rounded-full bg-emerald-400 text-white transition-transform duration-300 ${
                      microsite.phone ? "group-hover:scale-110" : ""
                    }`}
                  />
                </a>
              </div>
            )}
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
