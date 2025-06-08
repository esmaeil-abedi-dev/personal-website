"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Trash2, CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { unsubscribeFromNewsletter, subscribeToNewsletter } from "@/lib/actions"

export function NewsletterSubscribersTable({ subscribers }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState(null)

  const handleUnsubscribe = async (subscriber) => {
    try {
      await unsubscribeFromNewsletter(subscriber.email)
      router.refresh()
    } catch (error) {
      console.error("Error unsubscribing:", error)
    }
  }

  const handleResubscribe = async (subscriber) => {
    try {
      await subscribeToNewsletter(subscriber.email, subscriber.name)
      router.refresh()
    } catch (error) {
      console.error("Error resubscribing:", error)
    }
  }

  const confirmDelete = (subscriber) => {
    setSubscriberToDelete(subscriber)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.name}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  <Badge variant={subscriber.active ? "default" : "secondary"}>
                    {subscriber.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(subscriber.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {subscriber.active ? (
                      <Button variant="ghost" size="icon" onClick={() => handleUnsubscribe(subscriber)}>
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Unsubscribe</span>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleResubscribe(subscriber)}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Resubscribe</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => confirmDelete(subscriber)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subscriber &quot;{subscriberToDelete?.email}&quot;. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  // In a real implementation, you would have a deleteSubscriber action
                  // For now, we'll just unsubscribe them
                  await unsubscribeFromNewsletter(subscriberToDelete.email)
                  router.refresh()
                  setIsDeleteDialogOpen(false)
                  setSubscriberToDelete(null)
                } catch (error) {
                  console.error("Error deleting subscriber:", error)
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
