'use client';
import { useEffect, useState } from 'react';
import pfp from '/public/pfp.jpg';
import Markdown from 'react-markdown';
import { PersonCircle } from 'react-bootstrap-icons';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Image from 'next/image';
import Backdrop from '../../common/backdrop';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserContext } from '@/app/layout';
import { useContext } from 'react';

const loginAnim = {
    hidden: {
        opacity: 0,
        y: '-90px',
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: '0',

        transition: {
            duration: 0.1,
            type: 'spring',
            damping: 50,
            stiffness: 500,
        },
    },
    exit: {
        scale: 0.9,
        y: '-30px',
    },
};

const summary = {
    name: 'Arihan Sharma',
    desc: `I have been skipping all my classes (I'm cooked)`,
    email: 'sofwarearihan@gmail.com',
    investors: 20,
};

function Student2({ data, special = false }) {
    const {
        displayCreateContract,
        setDisplayCreateContract,
        currentContract,
        setCurrentContract,
    } = useContext(UserContext);
    return (
        <div className={'flex flex-col'}>
            <button className="py-5 bg-transparent">
                <Link
                    href={'/profile/' + data.testnetId}
                    className="duration-300 text-zinc-100 hover:text-green-400 transition-all hover:border-[1.5px] bg-gray-50/[0.01] hover:bg-gray-50/[0.05] hover:shadow-sm border-gray-300/20 rounded-xl p-6 flex flex-col gap-3 w-full"
                >
                    <div className="flex flex-col items-center gap-5">
                        <Image
                            alt="Profile picture"
                            src={pfp}
                            className="w-2/3 rounded-full"
                        />
                        <h3 className="text-sm font-[400] md:text-[1.1rem]">
                            {data.firstName + ' ' + data.lastName}
                        </h3>
                    </div>
                </Link>
            </button>
            <button
                className="self-center w-fit"
                onClick={() => {
                    setCurrentContract(data);
                    setDisplayCreateContract(true);
                }}
            >
                Contract
            </button>
        </div>
    );
}

function Tabs({ data, investorData }) {
    return (
        <TabGroup className="p-3 flex-grow min-w-[20rem] max-w-[65rem] w-11/12">
            <TabList className="space-x-3">
                <Tab className="py-2 transition-all duration-300 border-2 border-b-0 rounded-lg rounded-b-none outline-none border-zinc-800 ui-not-selected:opacity-40 hover:border-zinc-500 ui-selected:border-green-500/60 ui-selected:bg-green-950/30 hover:px-7 ui-selected:px-10">
                    <div className="flex flex-row items-center gap-3">
                        <PersonCircle />
                        Students
                    </div>
                </Tab>
            </TabList>
            <TabPanels className="text-gray-300">
                <TabPanel className="grid w-full h-full grid-cols-2 p-3 border-2 rounded-b-2xl border-zinc-800 md:grid-cols-4 xl:grid-cols-4">
                    {data.map((student) => {
                        // Return the Student2 component for each student
                        return <Student2 key={student._id} data={student} />;
                    })}
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
}

function InvestorDash({ params }) {
    const [data, setData] = useState([]);
    const [investorData, setInvestorData] = useState([]);
    const { nearId } = useContext(UserContext);

    useEffect(() => {
        fetch(`/api/student/`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setData(data);
            });
        // Also fetch everyone this investor has invested in
        fetch(`/api/contracts?investorId=${params.slug}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setInvestorData(data);
            });
    }, [params.slug]);

    return (
        <div className="flex flex-col items-center justify-center w-screen font-sgt">
            <div className="min-w-[30rem] max-w-[65rem] w-11/12 font-sgt p-3 rounded-lg gap-8 flex flex-row">
                <div className="w-full group">
                    <h1 className="font-bold w-full h-32 from-emerald-600/40 to-zinc-800 group-hover:to-green-500 bg-gradient-to-tr rounded-xl duration-500 transition-all p-[1px] group-hover:p-[4px]">
                        <div className="w-full h-full flex items-center justify-center bg-[#101010] rounded-[12px]">
                            Investor Dashboard
                        </div>
                    </h1>
                </div>
            </div>
            <Tabs data={data} investorData={investorData} />
        </div>
    );
}

export default InvestorDash;
