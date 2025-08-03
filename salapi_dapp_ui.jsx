import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { gsap } from "gsap";

const salapiAbi = [
    "function setKYC(address _user, bool _status) external",
    "function mintToken(string _purposeTag) public",
    "function totalSupply() public view returns (uint256)"
];

const salapiAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

export default function SalapiDApp() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [supply, setSupply] = useState("0");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("en");

    const translations = {
        en: {
            title: "SALAPI Token DApp",
            connect: "Connect MetaMask",
            kyc: "Verify KYC",
            mint: "Mint SALAPI Token",
            connected: "Wallet",
            supply: "Total Supply"
        },
        tl: {
            title: "SALAPI Token Aplikasyon",
            connect: "Ikonek ang MetaMask",
            kyc: "I-verify ang KYC",
            mint: "Gumawa ng SALAPI Token",
            connected: "Wallet",
            supply: "Kabuuang Supply"
        }
    };

    useEffect(() => {
        gsap.from(".header", { y: -50, opacity: 0, duration: 1 });
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const salapiContract = new ethers.Contract(salapiAddress, salapiAbi, signer);
            const address = await signer.getAddress();

            setAccount(address);
            setProvider(provider);
            setContract(salapiContract);

            const currentSupply = await salapiContract.totalSupply();
            setSupply(ethers.formatUnits(currentSupply, 18));

            gsap.from(".actions button", { opacity: 0, y: 30, stagger: 0.2 });
        } else {
            alert("Please install MetaMask");
        }
    };

    const verifyKYC = async () => {
        setLoading(true);
        const tx = await contract.setKYC(account, true);
        await tx.wait();
        alert("KYC Verified for: " + account);
        setLoading(false);
    };

    const mintSalapi = async () => {
        setLoading(true);
        const tx = await contract.mintToken("Community Benefit");
        await tx.wait();
        alert("SALAPI Token Minted!");
        const updatedSupply = await contract.totalSupply();
        setSupply(ethers.formatUnits(updatedSupply, 18));
        gsap.from(".mint-animation", { y: -50, opacity: 0, duration: 1, ease: "bounce" });
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-200 to-blue-200 text-center p-4">
            <h1 className="header text-4xl md:text-5xl font-extrabold text-green-700 mb-6">
                {translations[language].title}
            </h1>

            <div className="mb-4">
                <button onClick={() => setLanguage("en")} className="mx-2 text-sm underline">English</button>
                <button onClick={() => setLanguage("tl")} className="mx-2 text-sm underline">Tagalog</button>
            </div>

            {!account ? (
                <button onClick={connectWallet} className="bg-blue-500 text-white px-8 py-3 rounded-xl text-lg hover:bg-blue-600">
                    {translations[language].connect}
                </button>
            ) : (
                <div className="actions space-y-4 w-full max-w-md">
                    <p className="text-lg font-semibold break-all">{translations[language].connected}: {account}</p>
                    <p className="text-xl font-bold">{translations[language].supply}: {supply} SALAPI</p>

                    <button onClick={verifyKYC} disabled={loading} className="w-full bg-yellow-400 text-black py-3 rounded-xl text-lg hover:bg-yellow-500">
                        {translations[language].kyc}
                    </button>
                    <button onClick={mintSalapi} disabled={loading} className="w-full bg-green-500 text-white py-3 rounded-xl text-lg hover:bg-green-600">
                        {translations[language].mint}
                    </button>

                    <div className="mint-animation text-3xl">💰</div>
                </div>
            )}
        </div>
    );
}
