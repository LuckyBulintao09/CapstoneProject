import React from 'react'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CreateRoomModal from '@/modules/add-room/CreateRoomModal';
import CreateRoomForm from '@/modules/add-room/CreateRoomForm';

const BranchDetails = ({ params }: { params: { branchId: string } }) => {
  return (
      <div className="space-y-3">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Rooms for Branch: {params.branchId}
          </h4>
            <CreateRoomModal 
                trigger={
                    <Button
                        variant="default"
                        className="w-full"
                    >
                        Add Room
                    </Button>
                }
                title="Add a Room"
                description='Add a new room for your branch. Click submit when done.'
            >
                <CreateRoomForm />
            </CreateRoomModal>
          <Card className="relative h-max border-none shadow-md">
              <CardHeader className="px-1 overflow-hidden py-1.5 absolute top-1 left-1 w-max shadow-sm ml-r z-10">
                  <Badge className="bg-green-500 hover:bg-green-500/90">
                      Available
                  </Badge>
              </CardHeader>
              <div className="">
                  <img
                      src={"https://picsum.photos/400/250"}
                      className="bg-cover bg-center rounded-lg w-full"
                  />
              </div>
              <CardFooter className="px-3 bg-secondary/20 border-white/20 backdrop-blur-md border overflow-hidden py-1.5 absolute before:rounded-xl rounded-xl bottom-1 w-[calc(100%_-_9px)] shadow-sm ml-1 z-10">
                  <div className="flex justify-between w-full items-center">
                      <p className="text-xs text-white truncate">
                          Address lorem ipsum dolor sit amet.
                      </p>
                      <Link
                          href={"/property/room"}
                          className={cn(
                              buttonVariants({
                                  variant: "default",
                                  size: "sm",
                              }),
                              "m-0 text-xs rounded-full text-white"
                          )}
                      >
                          See more
                      </Link>
                  </div>
              </CardFooter>
          </Card>
      </div>
  );
}

export default BranchDetails