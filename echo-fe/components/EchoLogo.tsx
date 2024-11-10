import Image from 'next/image'




export default function EchoLogo() {
    return (
            <Image
                src="/images/echo-wave.svg"
                alt="Echo wave"
                width={70}
                height={70}
                className="mt-2"
            />
    )
}