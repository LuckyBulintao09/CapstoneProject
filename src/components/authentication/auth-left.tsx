
function AuthLeft() {
    return (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r airBnbDesktop:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                UniHomes Inc
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        ✨ UniHomes, an unimaginably unique real estate platform, universally—unimpeded, unimpressed by its rivals and ever so
                        unimposing with its unequevocaly intuitive unitizations within its catalogue. Ultimately, tis unironically an unequalled
                        platform that helps the unimpressed, uninformed, and the uninspired find unity and unison in UniHomes ✨
                    </p>
                    <footer className="text-sm text-right">Anonymous</footer>
                </blockquote>
            </div>
        </div>
    );
}

export default AuthLeft;
