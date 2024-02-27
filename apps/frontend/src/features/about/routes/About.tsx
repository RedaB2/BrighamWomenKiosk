import Abe from "../assests/Abraham Dionne.png";
import Daniel from "../assests/Daniel Feng.jpg";
import Reda from "../assests/Reda Boutayeb.png";
import Hien from "../assests/Hien Hoang.png";
import Lucas from "../assests/Lucas Lamenha.jpg";
import Miya from "../assests/Miya Judy.png";
import Oliver from "../assests/Oliver Gates.jpg";
import Philip from "../assests/Philip Heney.jpg";
import Giovanni from "../assests/Giovanni Larson Vasquez.jpg";
import Felix from "../assests/Felix Nguyen.jpg";
import Matt from "../assests/Matthew Gatta.jpg";

import { Modal } from "flowbite-react";
import { useState } from "react";

const About = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);
  const [open9, setOpen9] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [open11, setOpen11] = useState(false);

  return (
    <div className="text-center p-16 flex flex-col items-center h-screen container">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        WPI Computer Science Department, CS3733-C24 Software Engineering
      </h1>
      <h1 className="py-1 text-md italic font-semibold text-gray-500 dark:text-white">
        Prof. Wilson Wong, Coach: Ari Schechter
      </h1>

      <div className="container mx-auto p-12 grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Reda}
            alt=""
            onClick={() => setOpen1(true)}
          />
          <Modal dismissible show={open1} onClose={() => setOpen1(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  "Small circle, private life, peaceful mind” - Unknown
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="flex flex-col justify-between p-16 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Reda Boutayeb
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Assistant Lead Software + Algorithms
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Abe}
            alt=""
            onClick={() => setOpen2(true)}
          />
          <Modal dismissible show={open2} onClose={() => setOpen2(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  “I’m not superstitious, but I am a little stitious.” — Michael
                  Scott
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="p-8" />
          <div className="flex flex-col justify-between p-8 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Abraham Dionne
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Scrum Master + Front End
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Daniel}
            alt=""
            onClick={() => setOpen3(true)}
          />
          <Modal dismissible show={open3} onClose={() => setOpen3(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base italic leading-relaxed text-gray-500 dark:text-white">
                  "Noot noot. I'm in." -Michelle Yu
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="p-8" />
          <div className="flex flex-col justify-between p-8 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Daniel Feng
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Project Manager + Front End
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Hien}
            alt=""
            onClick={() => setOpen4(true)}
          />
          <Modal dismissible show={open4} onClose={() => setOpen4(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  “I’m fa(n)t(tastic).” - Hien Hoang
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="p-8" />
          <div className="flex flex-col justify-between p-12 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Hien Hoang
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Database + Algorithms
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Lucas}
            alt=""
            onClick={() => setOpen5(true)}
          />
          <Modal dismissible show={open5} onClose={() => setOpen5(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  “You only live once, but if you do it right, once is enough.”
                  - Mae West
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="flex flex-col justify-between p-8 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lucas Lamenha
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Assistant Lead Software Engineer + Databases
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Miya}
            alt=""
            onClick={() => setOpen6(true)}
          />
          <Modal dismissible show={open6} onClose={() => setOpen6(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  “You don’t have time to be timid you must be bold. Daring.”
                  -Lumiere
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="p-8" />
          <div className="flex flex-col justify-between p-8 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Miya Judy
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Product Owner + Front End
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Oliver}
            alt=""
            onClick={() => setOpen7(true)}
          />
          <Modal dismissible show={open7} onClose={() => setOpen7(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  “I’m running around New York with a pack of wild lesbians!” -
                  Billy Eichner
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="p-8" />
          <div className="flex flex-col justify-between p-12 leading-normal text-center">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Oliver Gates
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Front End
            </p>
          </div>
          <div className="p-8" />
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Philip}
            alt=""
            onClick={() => setOpen8(true)}
          />
          <Modal dismissible show={open8} onClose={() => setOpen8(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  “This is a quote.” - Philip Heney
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="flex flex-col justify-between p-16 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Philip Heney
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Documentation Analyst + Front End
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Giovanni}
            alt=""
            onClick={() => setOpen9(true)}
          />
          <Modal dismissible show={open9} onClose={() => setOpen9(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  "The cake is a lie." - Portal
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="flex flex-col justify-between p-12 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Giovanni Larson Vasquez
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Front end + database
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Felix}
            alt=""
            onClick={() => setOpen10(true)}
          />
          <Modal dismissible show={open10} onClose={() => setOpen10(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  "I don't know" - Felix
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Thinh (Felix) Nguyen
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Lead Software Engineer + Front end + Databases
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Matt}
            alt=""
            onClick={() => setOpen11(true)}
          />
          <Modal dismissible show={open11} onClose={() => setOpen11(false)}>
            <Modal.Header>Favorite Quote</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                  "Welcome! I’m Matt and here my top 7 reasons why I should be
                  on Survivor 47. Reason Number 1: I am really good at making
                  Fire. Puzzles? No Problem! My Puzzle Soling Skills are
                  unmatched. Reason Number 3: I am really good at foraging for
                  Food. Reason Number 4: Shelter is crucial for Survivor.
                  Luckily, I am a master shelter builder. Reason Number 5: I am
                  Stealthy as a Ninja, so they’ll Never see me coming. Oh Hello,
                  I didn’t see you there. In survivor, being centered and being
                  one step ahead of your opponent is crucial. I am harnessing my
                  inner Zen to anticipate my opponents moves [Bong] Reason
                  Number 7: I train in the most extreme elements every day, so I
                  am ready for anything survivor throws my way. Well, there you
                  have it. 7 Indisputable reasons why I am the perfect candidate
                  for Survivor. Give me the call and I will give you even more
                  ways I can outwit, outplay, and outlast the competition." -
                  Matt
                </p>
              </div>
            </Modal.Body>
          </Modal>
          <div className="p-8" />
          <div className="flex flex-col justify-between p-16 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Matthew Gatta
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-white">
              Back-End Engineer
            </p>
          </div>
        </div>
      </div>

      <p className="py-4 text-md italic font-semibold text-gray-500 dark:text-white">
        Thanks to Brigham and Women's Hospital and their representative, Andrew
        Shinn.
      </p>
      <p
        className="text-center text-md italic font-semibold text-gray-500 dark:text-white"
        style={{
          textWrap: "balance",
        }}
      >
        The Brigham & Women's Hospital maps and data used in this application
        are copyrighted and provided for the sole use of educational purposes.
      </p>
    </div>
  );
};

export { About };
