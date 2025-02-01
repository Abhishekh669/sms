import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"



export interface UserType{
    id : string, 
    name  :string,
    email : string,
    role : string,
    createdAt : string,
    image_url : string,
    class ?: string,
    userId : string
}

interface OnboardingRequestCardProps {
  request: UserType,
  onAccept: ({id , role} : {id : string, role : string}) => void
  onReject: (id : string) => void
}

export function OnboardingRequestCard({ request, onAccept, onReject }: OnboardingRequestCardProps) {

  const handleAccept = async () => {
    await onAccept({id : request?.id, role : request?.role})
  }

  const handleReject = async () => {
    await onReject(request.userId)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={request.image_url} alt={request.name} />
          <AvatarFallback>{request.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{request.name.toUpperCase()}</CardTitle>
          <p className="text-sm text-muted-foreground">{request.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-semibold">Role</p>
            <p className="text-sm">{request.role}</p>
          </div>
          {
            request?.class && (
              <div>
            <p className="text-sm font-semibold">Class</p>
            <p className="text-sm">{request.class}</p>
          </div>
            )
          }
          
        </div>
        <div className="mt-4">
          <Badge variant="secondary">
          {formatDistanceToNow(parseISO(request.createdAt), { addSuffix: true, includeSeconds : true })}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm"  className=" text-muted-foreground hover:text-black bg-rose-200/50 hover:bg-rose-300/50" onClick={handleReject} >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button variant="default" size="sm" onClick={handleAccept} className=" hover:text-black text-muted-foreground bg-green-200/50 hover:bg-green-300/50" >
          <CheckCircle className="mr-2 h-4 w-4 " />
          Verify
        </Button>
      </CardFooter>
    </Card>
  )
}

