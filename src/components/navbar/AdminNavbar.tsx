"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { logout } from "@/app/auth/login/actions";
import { createClient } from "@/utils/supabase/client";

function AdminNavbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setLoggedIn(true);
      } else {
        console.log("No session found.");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="md:sticky md:top-0 z-50">
      <div className="relative bg-cover">
        <div className="backdrop-blur-sm bg-[#030b1f]/90">
          <div className="flex justify-between items-center p-4">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={160}
              height={80}
              className="h-8 w-auto"
            />
            {loggedIn && (
              <Button
                size="sm"
                onClick={async () => {
                  await logout();
                  window.location.href = "/";
                }}
                variant="outline"
                className="text-gray-200 hover:bg-[#02091a] hover:text-gray-400"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
