"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, Button, Input, Textarea, Flex, Heading, Text } from "@/once-ui/components"
import { sendContactForm } from "@/app/utils/actions"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await sendContactForm(values)
      form.reset()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <Flex
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card style={{ maxWidth: 480, width: "100%" }}>
        <Flex direction="column" gap="24" padding="32" style={{ width: "100%" }}>
          Get In Touch
          <Heading as="h1" variant="heading-strong-l" align="center">
            Have a project in mind or want to chat? Send me a message!
          </Heading>
          {isSuccess ? (
            <Flex direction="column" style={{ alignItems: "center", gap: "16px" }}>
              <Text variant="body-strong-m" color="success">
                Message Sent!
              </Text>
              <Text variant="body-default-m">
                Thank you for your message. I'll get back to you soon.
              </Text>
              <Button onClick={() => setIsSuccess(false)} variant="primary">
                Send Another Message
              </Button>
            </Flex>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Flex direction="column" gap="16" style={{ width: "100%" }}>
                <Input
                  id="name"
                  label="Name"
                  placeholder="Your name"
                  style={{ width: "100%" }}
                  {...form.register("name")}
                  error={!!form.formState.errors.name}
                />
                <Input
                  id="email"
                  label="Email"
                  placeholder="Your email"
                  type="email"
                  style={{ width: "100%" }}
                  {...form.register("email")}
                  error={!!form.formState.errors.email}
                />
                <Input
                  id="subject"
                  label="Subject"
                  placeholder="Message subject"
                  style={{ width: "100%" }}
                  {...form.register("subject")}
                  error={!!form.formState.errors.subject}
                />
                <Textarea
                  id="message"
                  label="Message"
                  placeholder="What would you like to say?"
                  lines={5}
                  style={{ width: "100%" }}
                  {...form.register("message")}
                  error={!!form.formState.errors.message}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  style={{ width: "100%" }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </Flex>
            </form>
          )}
        </Flex>
      </Card>
    </Flex>
    {/* <Flex justify="center" align="center" style={{ minHeight: "80vh" }}>
      <Card style={{ maxWidth: 480, width: "100%" }}>
        <Flex direction="column" gap="24" padding="32" style={{ width: "100%" }}>
          Get In Touch
          <Heading as="h1" variant="heading-strong-l" align="center">
            Have a project in mind or want to chat? Send me a message!
          </Heading>
          {isSuccess ? (
            <Flex direction="column" align="center" gap="16">
              <Text variant="body-strong-m" color="success">
                Message Sent!
              </Text>
              <Text variant="body-default-m">Thank you for your message. I'll get back to you soon.</Text>
              <Button onClick={() => setIsSuccess(false)} variant="primary">
                Send Another Message
              </Button>
            </Flex>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Flex direction="column" gap="16" style={{ width: "100%" }}>
                <Input
                  id="name"
                  label="Name"
                  placeholder="Your name"
                  style={{ width: "100%" }}
                  {...form.register("name")}
                  error={!!form.formState.errors.name}
                />
                <Input
                  id="email"
                  label="Email"
                  placeholder="Your email"
                  type="email"
                  style={{ width: "100%" }}
                  {...form.register("email")}
                  error={!!form.formState.errors.email}
                />
                <Input
                  id="subject"
                  label="Subject"
                  placeholder="Message subject"
                  style={{ width: "100%" }}
                  {...form.register("subject")}
                  error={!!form.formState.errors.subject}
                />
                <Textarea
                  id="message"
                  label="Message"
                  placeholder="What would you like to say?"
                  lines={5}
                  style={{ width: "100%" }}
                  {...form.register("message")}
                  error={!!form.formState.errors.message}
                />
                <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: "100%" }}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </Flex>
            </form>
          )}
        </Flex>
      </Card>
    </Flex> */}
    </>
    
  )
}

