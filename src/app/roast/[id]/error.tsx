'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function RoastError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 bg-zinc-900 border-zinc-800 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 bg-red-500/10 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white">Oops! Algo deu errado</h2>
                    <p className="text-zinc-400">
                        Não conseguimos carregar os detalhes desse roast. Pode ser um problema temporário de conexão ou o relatório ainda está sendo processado.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => reset()}
                        className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-xl flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Tentar Novamente
                    </Button>

                    <Link href="/" className="w-full">
                        <Button
                            variant="outline"
                            className="w-full border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Voltar ao Início
                        </Button>
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-4 bg-black rounded-lg text-left overflow-auto max-h-32">
                        <code className="text-xs text-red-400">{error.message}</code>
                    </div>
                )}
            </Card>
        </div>
    )
}
