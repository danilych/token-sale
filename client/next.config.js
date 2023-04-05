/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    WALLET_CONNECT_ID: process.env.WALLET_CONNECT_ID,
  }
}

module.exports = nextConfig
