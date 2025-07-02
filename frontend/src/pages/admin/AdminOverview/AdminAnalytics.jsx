"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function AdminAnalytics({ orders }) {
    const dailyCustomers = useMemo(() => {
        const customerCounts = orders.reduce((acc, order) => {
            const date = new Date(order.date).toLocaleDateString()
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {})

        return Object.entries(customerCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7)
            .reverse()
    }, [orders])

    const topCustomers = useMemo(() => {
        const customerTotals = orders.reduce((acc, order) => {
            const { name } = order.customer
            acc[name] = (acc[name] || 0) + order.total
            return acc
        }, {})

        return Object.entries(customerTotals)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
    }, [orders])

    const bestSellingProducts = useMemo(() => {
        const productSales = orders.flatMap(order => order.items)
            .reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity
                return acc
            }, {})

        return Object.entries(productSales)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
    }, [orders])

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Daily Customers (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyCustomers}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Customer Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topCustomers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#82ca9d" name="Total Spent (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bestSellingProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#ffc658" name="Quantity Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
