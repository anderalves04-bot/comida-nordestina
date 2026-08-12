/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Menu from '../components/Menu';
import { Dish } from '../types';

interface CardapioPageProps {
  dishes: Dish[];
}

export default function CardapioPage({ dishes }: CardapioPageProps) {
  return <Menu dishes={dishes} />;
}
