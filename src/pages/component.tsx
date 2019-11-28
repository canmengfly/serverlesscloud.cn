import * as React from 'react'
import Layout from '@src/layouts'
import Banner from '@src/components/Banner'
import {
  Box,
  Flex,
  Container,
  Background,
  Image,
  Text,
  Heading6,
} from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import componentConfig from '@src/constants/componentConfig'
import Card from '@src/components/Card'
import { LazyImage } from 'react-lazy-images'
import placeholderImg from '@src/assets/images/placeholder.png'
import { Link } from 'gatsby'
import theme from '@src/constants/theme'

const CustomContainer = styled(Container)`
  flex: 1;
`

interface Props {
  location: string
}

const ComponentPage = ({ location }: Props) => {
  return (
    <Layout>
      <Helmet
        title="Serverless - Serverless Component"
        descirption="Serverless Framework 提供贴合应用场景的框架和组件，开发者根据实际需求选择对应框架后，即可在数秒内快速构建和部署 Serverless 应用"
        location={location}
      />
      <Banner
        title="Components"
        subTitle="Serverless Framework 提供贴合应用场景的框架和组件，开发者根据实际需求选择对应框架后，即可在数秒内快速构建和部署 Serverless 应用"
      />

      <CustomContainer maxWidth={[1216, 1216, 1216, '85%', '90%', 1216]}>
        <Flex flexWrap="wrap">
          {componentConfig.map(component => (
            <Link to={component.link} key={component.name}>
              <Card height="386px" width={[0.9, 0.9, 340, 360]}>
                <LazyImage
                  src={component.thumbnail}
                  alt={component.slogan}
                  actual={({ imageProps }) => {
                    return (
                      <Background
                        width={[1]}
                        height={[200]}
                        background={`url(${JSON.stringify(
                          component.thumbnail
                        )})`}
                        backgroundSize="cover"
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                      />
                    )
                  }}
                  placeholder={({ imageProps, ref }) => (
                    <Image
                      {...imageProps}
                      ref={ref}
                      src={placeholderImg}
                      width={1}
                    />
                  )}
                />
                <Box py="30px" px="20px">
                  <Text fontSize="18px" fontWeight="bold" mb="8px">
                    {component.slogan}
                  </Text>
                  <Text
                    py={'5px'}
                    fontSize="14px"
                    lineHeight="18px"
                    mb="10px"
                    color={theme.colors.gray[2]}
                  >
                    {component.description}
                  </Text>
                  <Text color={theme.colors.serverlessRed} fontSize="14px">
                    查看详情&nbsp;>
                  </Text>
                </Box>
              </Card>
            </Link>
          ))}
        </Flex>
      </CustomContainer>
    </Layout>
  )
}

export default ComponentPage
