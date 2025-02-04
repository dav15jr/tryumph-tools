"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { motion } from "framer-motion"

export default function HomePage() {
  const { user } = useAuth()

  const toolsData = [
    {
      title: "Wheel Of Life",
      description:
        "Improve your life today using our unique Wheel Of Life tool. Find out which areas you need to improve and set your SMART goals on how to achieve it.",
      image: "/placeholder.svg?height=400&width=400",
      link: "/wheel-of-life",
    },
    {
      title: "Productivity Planner",
      description:
        "Increase your productivity using our custom Productivity Planner. Break down your week and see where you can improve to achieve your goals.",
      image: "/placeholder.svg?height=400&width=400",
      link: "/planner",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12 flex-grow">
        <motion.h1
          className="text-4xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Tryumph Tools
        </motion.h1>
        <motion.p
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Empower your personal growth journey with our suite of tools designed to help you achieve your goals and live
          your best life.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {toolsData.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative h-48 md:h-64">
                    <Image
                      src={tool.image || "/placeholder.svg"}
                      alt={`${tool.title} Tool`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <CardTitle className="text-2xl text-center mb-4 text-purple-600">{tool.title}</CardTitle>
                  <p className="text-center text-gray-600 mb-6 flex-grow">{tool.description}</p>
                  <Link href={tool.link} className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full text-purple-600 border-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      Explore {tool.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}

